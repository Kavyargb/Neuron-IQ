/**
 * build.js — Neuron-IQ Static Knowledge Graph Compiler
 *
 * Orchestrates the full build pipeline:
 *   1. Parse CLI args
 *   2. Discover & parse all content Markdown files
 *   3. Validate frontmatter (required fields, distance, aliases)
 *   4. Split sections, render Markdown + KaTeX → HTML
 *   5. Validate parent references (post-load)
 *   6. Infer internal links via Aho-Corasick (O(n))
 *   7. Copy PDFs (recursive)
 *   8. Render article/book pages + sitemap
 *   9. Emit client-side graph payload (graph.js)
 *  10. Compile Workbox service worker (sw.js)
 *
 * Usage:
 *   node build.js [--strict] [--quiet] [--help]
 *
 * See utils.js, templates.js, linker.js for extracted modules.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { generateSW } = require('workbox-build');

const {
    Logger,
    slugify,
    cleanMarkdown,
    truncateDescription,
    escapeHtmlAttr,
    getAllFiles,
    copyFilesRecursive,
    parseCliArgs,
    HELP_TEXT,
} = require('./utils');

const { getArticleTemplate, getBookTemplate, getSitemapTemplate } = require('./templates');
const { inferLinks } = require('./linker');

// ─── Constants ──────────────────────────────────────────────────────────────

const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'graph.js');

// ─── Main Pipeline ──────────────────────────────────────────────────────────

async function buildGraph() {
    // ── CLI ──────────────────────────────────────────────────────────────
    const flags = parseCliArgs();

    if (flags.help) {
        console.log(HELP_TEXT);
        process.exit(0);
    }

    const log = new Logger(flags.quiet);
    log.info('Neuron-IQ build starting…');

    const stats = {
        filesScanned: 0,
        filesSkipped: 0,
        pagesGenerated: 0,
        linksInferred: 0,
        pdfsCopied: 0,
    };

    // ── Dynamic ESM imports (marked is ESM-only) ────────────────────────
    const { marked } = await import('marked');
    const { default: markedKatex } = await import('marked-katex-extension');
    marked.use(markedKatex({ throwOnError: false }));

    // ── Ensure output directory exists ──────────────────────────────────
    fs.mkdirSync(outputDir, { recursive: true });

    // ── Phase 1: Discover all .md files ─────────────────────────────────
    const files = getAllFiles(contentDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => path.relative(contentDir, f).replace(/\\/g, '/'));

    stats.filesScanned = files.length;
    log.info(`Found ${files.length} Markdown files in content/`);

    const graphData = {};
    const categoriesMap = {};
    const nodesList = [];

    // ── Phase 2–4: Parse, validate, and assemble nodes ──────────────────
    for (const file of files) {
        try {
            const rawText = fs.readFileSync(path.join(contentDir, file), 'utf-8');
            const { data: metadata, content: body } = matter(rawText);

            // ── Frontmatter validation ──────────────────────────────────
            const missingFields = [];
            if (!metadata.name) missingFields.push('name');
            if (!metadata.parent) missingFields.push('parent');
            if (!metadata.category) missingFields.push('category');

            if (missingFields.length > 0) {
                log.warn(`Skipping "${file}": missing required field(s): ${missingFields.join(', ')}`);
                stats.filesSkipped++;
                continue;
            }

            // ── Distance validation ─────────────────────────────────────
            let distance = parseInt(metadata.distance, 10);
            if (isNaN(distance)) {
                log.warn(`"${file}" (${metadata.name}): "distance" is missing or non-numeric, defaulting to 0`);
                distance = 0;
            }

            // ── Alias normalization (accept both 'alias' and 'aliases') ─
            let aliases = metadata.aliases || metadata.alias || [];
            if (!Array.isArray(aliases)) {
                aliases = [aliases];
            }
            aliases = aliases.map(String); // Ensure all entries are strings

            // ── Section splitting ───────────────────────────────────────
            const parts = body.split(/(?:^|\n)@([^\n]+)\n/);
            const sections = [];

            if (parts[0].trim()) {
                sections.push({
                    title: 'Overview',
                    id: 'overview',
                    contentHTML: marked.parse(parts[0].trim(), { breaks: true }),
                    rawContent: parts[0].trim(),
                    isPreamble: true,
                });
            }

            for (let i = 1; i < parts.length; i += 2) {
                const title = parts[i].trim();
                const contentText = (parts[i + 1] || '').trim();
                sections.push({
                    title,
                    id: slugify(title),
                    contentHTML: marked.parse(contentText, { breaks: true }),
                    rawContent: contentText,
                    isPreamble: false,
                });
            }

            // ── Node assembly ───────────────────────────────────────────
            const nodeData = {
                ...metadata,
                aliases,
                distance,
                slug: slugify(metadata.name),
                searchContent: sections.map((sec) => cleanMarkdown(sec.rawContent)).join(' '),
                sectionTitles: sections.map((sec) => sec.title),
                sections,
            };

            graphData[metadata.name] = nodeData;
            nodesList.push(nodeData);

            if (!categoriesMap[metadata.category]) categoriesMap[metadata.category] = [];
            categoriesMap[metadata.category].push(nodeData);
        } catch (err) {
            log.error(`Failed to process "${file}": ${err.message}`);
            stats.filesSkipped++;
        }
    }

    log.info(`Parsed ${nodesList.length} nodes (${stats.filesSkipped} skipped)`);

    // ── Phase 5: Validate parent references ─────────────────────────────
    for (const node of nodesList) {
        if (node.parent !== 'Root' && !graphData[node.parent]) {
            log.warn(
                `"${node.name}" references parent "${node.parent}" which does not exist in the graph. ` +
                `Breadcrumbs will be truncated and parentLink may be a dead link.`
            );
        }
    }

    // ── Phase 6: Infer internal links (Aho-Corasick) ────────────────────
    log.info('Inferring internal links (Aho-Corasick)…');
    stats.linksInferred = inferLinks(nodesList);
    log.info(`Inferred ${stats.linksInferred} internal links across ${nodesList.length} nodes`);

    // ── Phase 7: Copy PDFs (recursive) ──────────────────────────────────
    const pdfSrcDir = path.join(contentDir, 'pdfs');
    const pdfDestDir = path.join(outputDir, 'pdfs');
    stats.pdfsCopied = copyFilesRecursive(pdfSrcDir, pdfDestDir, '.pdf', log);
    if (stats.pdfsCopied > 0) {
        log.info(`Copied ${stats.pdfsCopied} PDF file(s)`);
    }

    // ── Phase 8: Render pages ───────────────────────────────────────────
    for (const node of nodesList) {
        try {
            const parentLink = node.parent === 'Root' ? 'index.html' : `${slugify(node.parent)}.html`;

            // Build plain-text description (word-aware, HTML-attr-safe)
            const rawDesc = node.sections[0]?.contentHTML.replace(/<[^>]+>/g, '').trim() || '';
            const plainTextDesc = escapeHtmlAttr(truncateDescription(rawDesc, 155));

            // Build breadcrumb trail
            const pathArray = [];
            let curr = node;
            while (curr && curr.name !== 'Root') {
                pathArray.push(curr);
                curr = curr.parent ? graphData[curr.parent] : null;
            }
            pathArray.reverse();

            let breadcrumbsHTML = `<a href="index.html">Home</a>`;
            pathArray.forEach((item, index) => {
                breadcrumbsHTML +=
                    ` <span class="sep">/</span> ` +
                    (index === pathArray.length - 1
                        ? `<span class="current">${item.name}</span>`
                        : `<a href="${item.slug}.html">${item.name}</a>`);
            });

            // Write the page
            const html = node.pdf
                ? getBookTemplate(node, parentLink, plainTextDesc, breadcrumbsHTML)
                : getArticleTemplate(node, parentLink, plainTextDesc, breadcrumbsHTML);

            fs.writeFileSync(path.join(outputDir, `${node.slug}.html`), html.trim());
            stats.pagesGenerated++;
        } catch (err) {
            log.error(`Failed to render page for "${node.name}": ${err.message}`);
        }
    }

    // ── Phase 9: Render sitemap ─────────────────────────────────────────
    try {
        let sitemapCategoriesHTML = '';
        for (const [category, nodes] of Object.entries(categoriesMap)) {
            nodes.sort((a, b) => a.name.localeCompare(b.name));
            sitemapCategoriesHTML += `
            <div class="sitemap-category-card glass-panel">
                <h3 class="sitemap-category-title">${category}</h3>
                <ul class="sitemap-list">
                    ${nodes
                        .map(
                            (n) =>
                                `<li><a href="${n.slug}.html" class="sitemap-link"><span class="node-dist">Dist: ${n.distance}</span> ${n.name}</a></li>`
                        )
                        .join('')}
                </ul>
            </div>`;
        }
        fs.writeFileSync(path.join(outputDir, 'sitemap.html'), getSitemapTemplate(sitemapCategoriesHTML).trim());
        log.info('Sitemap generated');
    } catch (err) {
        log.error(`Failed to generate sitemap: ${err.message}`);
    }

    // ── Phase 10: Emit client-side graph payload ────────────────────────
    try {
        const clientGraphData = Object.fromEntries(
            Object.entries(graphData).map(([key, n]) => [
                key,
                {
                    name: n.name,
                    parent: n.parent,
                    category: n.category,
                    distance: n.distance,
                    slug: n.slug,
                    sectionTitles: n.sectionTitles,
                    searchContent: n.searchContent,
                    internalLinks: n.internalLinks,
                    aliases: n.aliases || [],
                },
            ])
        );

        fs.writeFileSync(
            outputFile,
            `// AUTO-GENERATED BY BUILD.JS\nwindow.NeuronMap = ${JSON.stringify(clientGraphData, null, 2)};`
        );
        log.info('graph.js emitted');
    } catch (err) {
        log.error(`Failed to write graph.js: ${err.message}`);
    }

    // ── Phase 11: Compile service worker via Workbox ────────────────────
    try {
        const { count, size, warnings } = await generateSW({
            globDirectory: outputDir,
            globPatterns: ['**/*.{html,js,css,json,svg}'],
            globIgnores: ['sw.js', '**/*.tmp', '**/*.log'],
            swDest: path.join(outputDir, 'sw.js'),
            clientsClaim: true,
            skipWaiting: true,
            navigateFallback: 'index.html',
            runtimeCaching: [
                {
                    urlPattern: /https:\/\/(?:cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'cdn-cache',
                        expiration: {
                            maxEntries: 100,
                            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
            ],
        });

        if (warnings.length > 0) {
            for (const w of warnings) {
                log.warn(`Workbox: ${w}`);
            }
        }
        log.info(`Service worker compiled (${count} files precached, ${size} bytes)`);
    } catch (err) {
        log.error(`Workbox service worker generation failed: ${err.message}`);
        throw err; // This is fatal — the build is incomplete without sw.js
    }

    // ── Build Summary ───────────────────────────────────────────────────
    log.summary(stats);

    // ── Exit code logic ─────────────────────────────────────────────────
    if (log.hasErrors) {
        process.exit(1);
    }
    if (flags.strict && log.hasWarnings) {
        log.info('--strict mode: exiting with code 1 due to warnings');
        process.exit(1);
    }
}

// ─── Entry Point ────────────────────────────────────────────────────────────

buildGraph().catch((err) => {
    console.error(err);
    process.exit(1);
});