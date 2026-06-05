/**
 * Neuron-IQ Custom Static Site Generator (SSG)
 * Converts markdown files inside the content/ directory into:
 * 1. Individual static article HTML pages with server-rendered math and dynamic breadcrumbs.
 * 2. An XML/HTML sitemap page mapping the database structure.
 * 3. A compiled, lightweight JSON data graph (graph.js) to power client-side search and D3 animations.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'graph.js');

/**
 * Converts titles and strings into URL-safe slug formats.
 * Example: "Real Numbers and their Operations" -> "real-numbers-and-their-operations"
 * 
 * @param {string} text Source text title.
 * @returns {string} URL-safe slug text.
 */
const slugify = (text) => text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')     // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-');     // Replace multiple consecutive hyphens with a single one

/**
 * Main build pipeline orchestrator.
 * Loads all files, compiles mathematics symbols, resolves links, and builds public assets.
 */
async function buildGraph() {
    // Dynamic imports for ESM marked libraries
    const { marked } = await import('marked');
    const { default: markedKatex } = await import('marked-katex-extension');

    // Attach Katex extension to pre-render math elements at build-time
    // This provides fast index loading and SEO searchability for equations
    marked.use(markedKatex({ throwOnError: false }));
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const graphData = {};
    const categoriesMap = {};
    const nodesList = [];

    // --- PHASE 1: Parse and Load All Knowledge Nodes ---
    files.forEach(file => {
        const rawText = fs.readFileSync(path.join(contentDir, file), 'utf-8');
        const parsed = matter(rawText);
        const metadata = parsed.data;
        const body = parsed.content;

        // Skip folders or files that are missing required frontmatter parameters
        if (!metadata.name || !metadata.parent || !metadata.category) return;

        /**
         * Splits markdown files into structured sections based on the "@SectionTitle" delimiter.
         * The text preceding the first "@" is treated as the default "Overview" preamble.
         * 
         * @returns {Array} Structured sections list.
         */
        const extractSections = () => {
            const sections = [];
            const parts = body.split(/(?:^|\n)@([^\n]+)\n/);
            
            const preamble = parts[0].trim();
            if (preamble) {
                sections.push({
                    title: 'Overview',
                    id: 'overview',
                    contentHTML: marked.parse(preamble, { breaks: true }),
                    rawContent: preamble,
                    isPreamble: true
                });
            }
            
            for (let i = 1; i < parts.length; i += 2) {
                const title = parts[i].trim();
                const contentText = (parts[i+1] || '').trim();
                sections.push({
                    title: title,
                    id: slugify(title),
                    contentHTML: marked.parse(contentText, { breaks: true }),
                    rawContent: contentText,
                    isPreamble: false
                });
            }
            return sections;
        };

        const sections = extractSections();
        const slug = slugify(metadata.name);
        
        /**
         * Strips markdown tokens, links, headers, HTML tags, and math notation
         * to generate a clean plain text blob for fuzzy searching.
         * 
         * @param {string} text Raw markdown block content.
         * @returns {string} Plain text search index.
         */
        const cleanMarkdown = (text) => {
            if (!text) return '';
            return text
                .replace(/<[^>]+>/g, '')                  // Strip HTML tags
                .replace(/\$\$/g, '')                     // Strip display math symbols
                .replace(/\$/g, '')                      // Strip inline math symbols
                .replace(/\*\*|__/g, '')                 // Strip bold symbols
                .replace(/\*|_/g, '')                    // Strip italics symbols
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Extract text labels from markdown links
                .replace(/\n/g, ' ')                      // Replace newlines with spaces
                .replace(/\s\s+/g, ' ')                  // Collapse consecutive spaces
                .trim();
        };
        const searchContent = sections.map(sec => cleanMarkdown(sec.rawContent)).join(" ");

        const nodeData = {
            ...metadata,
            distance: parseInt(metadata.distance, 10),
            slug: slug,
            searchContent: searchContent,
            sectionTitles: sections.map(sec => sec.title),
            sections: sections
        };

        graphData[metadata.name] = nodeData;
        nodesList.push(nodeData);

        // Group nodes by category to render structured cards in the sitemap page
        if (!categoriesMap[metadata.category]) categoriesMap[metadata.category] = [];
        categoriesMap[metadata.category].push(nodeData);
    });

    // --- PHASE 1.5: Compile Internal Links (Cross-node page connections) ---
    // Scans all documents to detect mentions of other node names.
    // Creates a list of cross-references similar to Obsidian links to show relational pathways in the D3 graph.
    nodesList.forEach(sourceNode => {
        sourceNode.internalLinks = [];
        nodesList.forEach(targetNode => {
            if (sourceNode.name === targetNode.name) return;
            const termEscaped = targetNode.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Regex checks that the concept name appears as a distinct word in searchContent
            const regex = new RegExp(`(?:^|\\W)${termEscaped}(?=\\W|$)`, 'i');
            if (regex.test(sourceNode.searchContent)) {
                sourceNode.internalLinks.push(targetNode.name);
            }
        });
    });

    // --- PHASE 2: Generate HTML Pages with Lineage Trace ---
    nodesList.forEach(node => {
        const parentLink = node.parent === 'Root' ? 'index.html' : `${slugify(node.parent)}.html`;
        const firstSectionHTML = node.sections.length > 0 ? node.sections[0].contentHTML : '';
        // Extract meta description from the first paragraph
        const plainTextDesc = firstSectionHTML.replace(/<[^>]+>/g, '').substring(0, 150).trim();
        
        // Tracing full lineage path dynamically
        // Recursively traces node -> parent -> grandparent up to virtual Root.
        // Reverses results to print path: Home / Parent / Concept.
        const pathArray = [];
        let curr = node;
        while (curr && curr.name !== 'Root') {
            pathArray.push(curr);
            const parentName = curr.parent;
            curr = parentName ? graphData[parentName] : null;
        }
        pathArray.reverse();
        
        let breadcrumbsHTML = `<a href="index.html">Home</a>`;
        pathArray.forEach((item, index) => {
            breadcrumbsHTML += ` <span class="sep">/</span> `;
            const isLast = index === pathArray.length - 1;
            if (isLast) {
                breadcrumbsHTML += `<span class="current">${item.name}</span>`;
            } else {
                breadcrumbsHTML += `<a href="${item.slug}.html">${item.name}</a>`;
            }
        });

        // HTML Layout Template for individual article nodes
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${node.name} - Neuron-IQ</title>
    <meta name="description" content="${plainTextDesc}...">
    <link rel="stylesheet" href="page.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <!-- Load shared libraries and data -->
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" defer></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
</head>
<body>
    <header class="top-nav">
        <a href="index.html" class="brand">Neuron-IQ</a>
        <nav class="nav-links">
            <a href="#" class="nav-link header-search-btn" id="global-search-trigger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search
            </a>
            <a href="sitemap.html" class="nav-link">Sitemap</a>
        </nav>
    </header>

    <main class="layout-grid">
        <article class="main-content">
            <nav class="breadcrumbs">
                ${breadcrumbsHTML}
            </nav>

            <div class="meta-row">
                <span class="badge category-badge">${node.category.toUpperCase()}</span>
                <span class="read-time">Distance from core: ${node.distance}</span>
            </div>

            <h1 class="article-title">${node.name}</h1>

            <div class="article-content">
                ${node.sections.map((sec, index) => `
                <section class="content-section content-tier" id="${sec.id}">
                    ${sec.isPreamble ? '' : `<h2 class="section-header">${sec.title}</h2>`}
                    ${sec.contentHTML}
                </section>
                `).join('\n')}
            </div>
        </article>

        <aside class="sidebar">
            <div class="sidebar-card">
                <h3 class="sidebar-title">On This Page</h3>
                <ul class="toc-list">
                    ${node.sections.map((sec, index) => `
                    <li><a href="#${sec.id}" class="${index === 0 ? 'active' : ''}">${sec.title}</a></li>
                    `).join('\n')}
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
                        <ul class="children-list" id="sidebar-children-list">
                            <!-- Populated dynamically via global.js -->
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    </main>    <!-- Client-side TOC Scroll Script -->
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const tocLinks = document.querySelectorAll(".toc-list a");
            
            tocLinks.forEach(link => {
                link.addEventListener("click", (e) => {
                    const href = link.getAttribute("href");
                    if (href.startsWith("#")) {
                        e.preventDefault();
                        
                        tocLinks.forEach(l => l.classList.remove("active"));
                        link.classList.add("active");
                        
                        const targetId = href.substring(1);
                        const target = document.getElementById(targetId);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            });
        });
    </script>
</body>
</html>`;

        fs.writeFileSync(path.join(outputDir, `${node.slug}.html`), htmlContent.trim());
    });

    // --- PHASE 3: Generate Sitemap Page ---
    // Renders categories cards with alphabetical lists of concepts to support SEO crawlers.
    let sitemapCategoriesHTML = '';
    for (const [category, nodes] of Object.entries(categoriesMap)) {
        nodes.sort((a, b) => a.name.localeCompare(b.name));
        
        let linksHTML = nodes.map(n => 
            `<li><a href="${n.slug}.html" class="sitemap-link"><span class="node-dist">Dist: ${n.distance}</span> ${n.name}</a></li>`
        ).join('');

        sitemapCategoriesHTML += `
            <div class="sitemap-category-card">
                <h3 class="sitemap-category-title">${category}</h3>
                <ul class="sitemap-list">
                    ${linksHTML}
                </ul>
            </div>
        `;
    }

    const sitemapHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Knowledge Sitemap - Neuron-IQ</title>
    <meta name="description" content="Explore the entire architecture of the Neuron-IQ knowledge database.">
    <link rel="stylesheet" href="page.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
</head>
<body>
    <header class="top-nav">
        <a href="index.html" class="brand">Neuron-IQ</a>
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
        
        <div class="sitemap-grid">
            ${sitemapCategoriesHTML}
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, 'sitemap.html'), sitemapHTML.trim());

    // --- PHASE 4: Compile graph.js ---
    // Creates a lightweight graph database. Strips out HTML body sections
    // to save browser bandwidth while retaining search tags and lineage metrics.
    const clientGraphData = {};
    for (const [key, node] of Object.entries(graphData)) {
        clientGraphData[key] = {
            name: node.name,
            parent: node.parent,
            category: node.category,
            distance: node.distance,
            slug: node.slug,
            sectionTitles: node.sectionTitles,
            searchContent: node.searchContent,
            internalLinks: node.internalLinks
        };
    }

    const outputContent = `// AUTO-GENERATED BY BUILD.JS\nwindow.NeuronMap = ${JSON.stringify(clientGraphData, null, 2)};`;
    fs.writeFileSync(outputFile, outputContent);
    console.log(`[Neuron-IQ] SEO Build complete! Processed ${files.length} pages + generated Sitemap.`);
}

buildGraph().catch(err => { console.error(err); process.exit(1); });