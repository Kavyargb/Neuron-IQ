const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { generateSW } = require('workbox-build');

const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'graph.js');

const slugify = (text) => text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

// --- HTML Layout Generators ---
const getArticleTemplate = (node, parentLink, plainTextDesc, breadcrumbsHTML) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#030712">
    <title>${node.name} - Neuron-IQ</title>
    <meta name="description" content="${plainTextDesc}...">
    <link rel="stylesheet" href="page.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" defer></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
    <script src="router.js" defer></script>
</head>
<body>
    <header class="top-nav">
        <a href="index.html" class="brand text-gradient">Neuron-IQ</a>
        <nav class="nav-links">
            <a href="#" class="nav-link header-search-btn" id="global-search-trigger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search
            </a>
            <a href="sitemap.html" class="nav-link">Sitemap</a>
        </nav>
    </header>

    <main class="layout-grid">
        <article class="main-content">
            <nav class="breadcrumbs">${breadcrumbsHTML}</nav>
            <div class="meta-row">
                <span class="badge category-badge">${node.category.toUpperCase()}</span>
                <span class="read-time">Distance from core: ${node.distance}</span>
            </div>
            <h1 class="article-title text-gradient">${node.name}</h1>
            <div class="article-content">
                ${node.sections.map((sec) => `
                <section class="content-section content-tier" id="${sec.id}">
                    ${sec.isPreamble ? '' : `<h2 class="section-header">${sec.title}</h2>`}
                    ${sec.contentHTML}
                </section>`).join('\n')}
            </div>
        </article>

        <aside class="sidebar">
            <div class="sidebar-card glass-panel">
                <h3 class="sidebar-title">On This Page</h3>
                <ul class="toc-list">
                    ${node.sections.map((sec, index) => `<li><a href="#${sec.id}" class="${index === 0 ? 'active' : ''}">${sec.title}</a></li>`).join('\n')}
                </ul>
                <hr class="sidebar-divider">
                <h3 class="sidebar-title">Concept Lineage</h3>
                <div class="lineage-tree">
                    <div class="lineage-item parent">
                        <span class="lineage-role">Parent Concept</span>
                        <a href="${parentLink}" class="lineage-link">← ${node.parent}</a>
                    </div>
                    <div class="lineage-item current">
                        <span class="lineage-role">Current Node</span>
                        <span class="lineage-name">${node.name}</span>
                    </div>
                    <div class="lineage-item children" id="lineage-children">
                        <span class="lineage-role">Sub-concepts</span>
                        <ul class="children-list" id="sidebar-children-list"></ul>
                    </div>
                </div>
            </div>
        </aside>
    </main>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const tocLinks = document.querySelectorAll(".toc-list a");
            tocLinks.forEach(link => link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href.startsWith("#")) {
                    e.preventDefault();
                    tocLinks.forEach(l => l.classList.remove("active"));
                    link.classList.add("active");
                    document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }));
        });
    </script>
</body>
</html>`;

const getSitemapTemplate = (sitemapCategoriesHTML) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#030712">
    <title>Knowledge Sitemap - Neuron-IQ</title>
    <meta name="description" content="Explore the entire architecture of the Neuron-IQ knowledge database.">
    <link rel="stylesheet" href="page.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
    <script src="router.js" defer></script>
</head>
<body>
    <header class="top-nav">
        <a href="index.html" class="brand text-gradient">Neuron-IQ</a>
        <nav class="nav-links">
            <a href="#" class="nav-link header-search-btn" id="global-search-trigger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search
            </a>
            <a href="sitemap.html" class="nav-link active">Sitemap</a>
        </nav>
    </header>
    <main class="sitemap-layout">
        <h1 class="article-title sitemap-title">Knowledge Architecture</h1>
        <p class="sitemap-subtitle">A complete map of the neural database, categorized by discipline. Essential for SEO bots and curious minds.</p>
        <div class="sitemap-grid">${sitemapCategoriesHTML}</div>
    </main>
</body>
</html>`;

const getBookTemplate = (node, parentLink, plainTextDesc, breadcrumbsHTML) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#030712">
    <title>${node.name} - Neuron-IQ</title>
    <meta name="description" content="${plainTextDesc}...">
    <link rel="stylesheet" href="page.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
    <script src="router.js" defer></script>
    <style>
        .book-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 75vh;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
            margin-top: 1rem;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        .epub-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 15px;
            background: rgba(0, 0, 0, 0.6);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            gap: 20px;
        }
        .epub-btn {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            border: 1px solid rgba(255,255,255,0.1);
            color: #e5e7eb;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-family: inherit;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .epub-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-1px);
        }
        #viewer {
            flex-grow: 1;
            width: 100%;
            background: #f9fafb;
            overflow: hidden;
        }
        .pdf-viewer {
            width: 100%;
            height: 100%;
            border: none;
            background: #111827;
        }
    </style>
</head>
<body>
    <header class="top-nav">
        <a href="index.html" class="brand text-gradient">Neuron-IQ</a>
        <nav class="nav-links">
            <a href="#" class="nav-link header-search-btn" id="global-search-trigger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search
            </a>
            <a href="sitemap.html" class="nav-link">Sitemap</a>
        </nav>
    </header>

    <main style="display: block; width: 100vw; height: calc(100vh - 60px); padding: 0; margin: 0; overflow: hidden; background: #fff;">
        <iframe src="${node.pdf.startsWith('http') ? node.pdf : `pdfs/${node.pdf}`}" style="width: 100%; height: 100%; border: none; display: block; background: #fff;"></iframe>
    </main>
</body>
</html>`;

// --- Main Builder Orchestrator ---
async function buildGraph() {
    const { marked } = await import('marked');
    const { default: markedKatex } = await import('marked-katex-extension');

    marked.use(markedKatex({ throwOnError: false }));
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const getAllFiles = function(dirPath, arrayOfFiles) {
        let filesList = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];
        filesList.forEach(function(file) {
            if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
                arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
            } else {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        });
        return arrayOfFiles;
    }
    const files = getAllFiles(contentDir).filter(f => f.endsWith('.md')).map(f => path.relative(contentDir, f).replace(/\\/g, '/'));
    const graphData = {}, categoriesMap = {}, nodesList = [];

    // --- PHASE 1: Parse and Load All Knowledge Nodes ---
    files.forEach(file => {
        const rawText = fs.readFileSync(path.join(contentDir, file), 'utf-8');
        const { data: metadata, content: body } = matter(rawText);
        if (!metadata.name || !metadata.parent || !metadata.category) return;

        const parts = body.split(/(?:^|\n)@([^\n]+)\n/);
        const sections = [];

        if (parts[0].trim()) {
            sections.push({ title: 'Overview', id: 'overview', contentHTML: marked.parse(parts[0].trim(), { breaks: true }), rawContent: parts[0].trim(), isPreamble: true });
        }

        for (let i = 1; i < parts.length; i += 2) {
            const title = parts[i].trim();
            const contentText = (parts[i + 1] || '').trim();
            sections.push({ title, id: slugify(title), contentHTML: marked.parse(contentText, { breaks: true }), rawContent: contentText, isPreamble: false });
        }

        const cleanMarkdown = (text) => text?.replace(/<[^>]+>/g, '').replace(/\$\$/g, '').replace(/\$/g, '').replace(/\*\*|__/g, '').replace(/\*|_/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/\n/g, ' ').replace(/\s\s+/g, ' ').trim() || '';

        const aliases = Array.isArray(metadata.aliases)
            ? metadata.aliases
            : (metadata.aliases ? [metadata.aliases] : []);

        const nodeData = {
            ...metadata,
            aliases,
            distance: parseInt(metadata.distance, 10),
            slug: slugify(metadata.name),
            searchContent: sections.map(sec => cleanMarkdown(sec.rawContent)).join(" "),
            sectionTitles: sections.map(sec => sec.title),
            sections
        };

        graphData[metadata.name] = nodeData;
        nodesList.push(nodeData);

        if (!categoriesMap[metadata.category]) categoriesMap[metadata.category] = [];
        categoriesMap[metadata.category].push(nodeData);
    });

    // --- PHASE 1.5: Compile Internal Links ---
    nodesList.forEach(sourceNode => {
        sourceNode.internalLinks = [];
        nodesList.forEach(targetNode => {
            if (sourceNode.name === targetNode.name) return;
            const termsToMatch = [targetNode.name, ...(targetNode.aliases || [])];
            const hasMatch = termsToMatch.some(term => {
                const termEscaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(`(?:^|\\W)${termEscaped}(?=\\W|$)`, 'i').test(sourceNode.searchContent);
            });
            if (hasMatch) {
                sourceNode.internalLinks.push(targetNode.name);
            }
        });
    });

    // --- PHASE 1.8: Copy Static Books ---
    const pdfDir = path.join(contentDir, 'pdfs');
    const outPdfDir = path.join(outputDir, 'pdfs');

    if (fs.existsSync(pdfDir)) {
        if (!fs.existsSync(outPdfDir)) fs.mkdirSync(outPdfDir, { recursive: true });
        fs.readdirSync(pdfDir).forEach(f => {
            if (f.endsWith('.pdf')) {
                fs.copyFileSync(path.join(pdfDir, f), path.join(outPdfDir, f));
            }
        });
    }

    // --- PHASE 2: Generate HTML Pages ---
    nodesList.forEach(node => {
        const parentLink = node.parent === 'Root' ? 'index.html' : `${slugify(node.parent)}.html`;
        const plainTextDesc = node.sections[0]?.contentHTML.replace(/<[^>]+>/g, '').substring(0, 150).trim() || '';

        const pathArray = [];
        let curr = node;
        while (curr && curr.name !== 'Root') {
            pathArray.push(curr);
            curr = curr.parent ? graphData[curr.parent] : null;
        }
        pathArray.reverse();

        let breadcrumbsHTML = `<a href="index.html">Home</a>`;
        pathArray.forEach((item, index) => {
            breadcrumbsHTML += ` <span class="sep">/</span> ` + (index === pathArray.length - 1 ? `<span class="current">${item.name}</span>` : `<a href="${item.slug}.html">${item.name}</a>`);
        });

        if (node.pdf) {
            fs.writeFileSync(path.join(outputDir, `${node.slug}.html`), getBookTemplate(node, parentLink, plainTextDesc, breadcrumbsHTML).trim());
        } else {
            fs.writeFileSync(path.join(outputDir, `${node.slug}.html`), getArticleTemplate(node, parentLink, plainTextDesc, breadcrumbsHTML).trim());
        }
    });

    // --- PHASE 3: Generate Sitemap Page ---
    let sitemapCategoriesHTML = '';
    for (const [category, nodes] of Object.entries(categoriesMap)) {
        nodes.sort((a, b) => a.name.localeCompare(b.name));
        sitemapCategoriesHTML += `
            <div class="sitemap-category-card glass-panel">
                <h3 class="sitemap-category-title">${category}</h3>
                <ul class="sitemap-list">
                    ${nodes.map(n => `<li><a href="${n.slug}.html" class="sitemap-link"><span class="node-dist">Dist: ${n.distance}</span> ${n.name}</a></li>`).join('')}
                </ul>
            </div>
        `;
    }
    fs.writeFileSync(path.join(outputDir, 'sitemap.html'), getSitemapTemplate(sitemapCategoriesHTML).trim());

    // --- PHASE 4: Compile graph.js ---
    const clientGraphData = Object.fromEntries(Object.entries(graphData).map(([key, n]) => [key, {
        name: n.name, parent: n.parent, category: n.category, distance: n.distance, slug: n.slug, sectionTitles: n.sectionTitles, searchContent: n.searchContent, internalLinks: n.internalLinks, aliases: n.aliases || []
    }]));

    fs.writeFileSync(outputFile, `// AUTO-GENERATED BY BUILD.JS\nwindow.NeuronMap = ${JSON.stringify(clientGraphData, null, 2)};`);
    console.log(`[Neuron-IQ] SEO Build complete! Processed ${files.length} pages + generated Sitemap.`);

    // --- PHASE 5: Compile sw.js (PWA Service Worker) using Workbox ---
    try {
        const { count, size, warnings } = await generateSW({
            globDirectory: outputDir,
            globPatterns: [
                '**/*.{html,js,css,json,svg}'
            ],
            globIgnores: [
                'sw.js',
                '**/*.tmp',
                '**/*.log'
            ],
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
                            maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }
            ]
        });

        if (warnings.length > 0) {
            console.warn('[Neuron-IQ] Workbox warnings:', warnings);
        }
        console.log(`[Neuron-IQ] Service Worker sw.js compiled by Workbox! Cached ${count} files, total size: ${size} bytes.`);
    } catch (error) {
        console.error('[Neuron-IQ] Error generating Service Worker with Workbox:', error);
        throw error;
    }
}

buildGraph().catch(err => { console.error(err); process.exit(1); });