const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'graph.js');

const slugify = (text) => text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

async function buildGraph() {
    const { marked } = await import('marked');
    const { default: markedKatex } = await import('marked-katex-extension');

    // Keep build-time Katex extension for standard expressions (for SEO/Fast-Load)
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

        if (!metadata.name || !metadata.parent || !metadata.category) return;

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
        
        const cleanHTML = (html) => html ? html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim() : '';
        const searchContent = sections.map(sec => cleanHTML(sec.contentHTML)).join(" ");

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

        // Group by category for sitemap
        if (!categoriesMap[metadata.category]) categoriesMap[metadata.category] = [];
        categoriesMap[metadata.category].push(nodeData);
    });

    // --- PHASE 2: Generate HTML Pages with Lineage Trace ---
    nodesList.forEach(node => {
        const parentLink = node.parent === 'Root' ? 'index.html' : `${slugify(node.parent)}.html`;
        const firstSectionHTML = node.sections.length > 0 ? node.sections[0].contentHTML : '';
        const plainTextDesc = firstSectionHTML.replace(/<[^>]+>/g, '').substring(0, 150).trim();
        
        // Tracing full lineage path dynamically
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

        // 1. ARTICLE PAGE TEMPLATE (Rebuilt for Tabbed Tiers, dynamic lineage, and global search)
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

    // 2. GENERATE SITEMAP PAGE FOR SEO
    let sitemapCategoriesHTML = '';
    for (const [category, nodes] of Object.entries(categoriesMap)) {
        // Sort alphabetically inside category
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

    const outputContent = `// AUTO-GENERATED BY BUILD.JS\nwindow.NeuronMap = ${JSON.stringify(graphData, null, 2)};`;
    fs.writeFileSync(outputFile, outputContent);
    console.log(`[Neuron-IQ] SEO Build complete! Processed ${files.length} pages + generated Sitemap.`);
}

buildGraph().catch(err => { console.error(err); process.exit(1); });