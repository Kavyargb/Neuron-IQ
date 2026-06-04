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

        const extractSection = (label) => {
            const regex = new RegExp(`(?:^|\\n)@${label}\\s*\\n([\\s\\S]*?)(?=(?:\\n@Beginner|\\n@Intermediate|\\n@Advanced|$))`);
            const match = body.match(regex);
            return match ? marked.parse(match[1].trim()) : '';
        };

        const slug = slugify(metadata.name);
        const content = {
            Beginner: extractSection('Beginner'),
            Intermediate: extractSection('Intermediate'),
            Advanced: extractSection('Advanced')
        };
        
        const cleanHTML = (html) => html ? html.replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim() : '';
        const searchContent = cleanHTML(content.Beginner) + " " + cleanHTML(content.Intermediate);

        const nodeData = {
            ...metadata,
            distance: parseInt(metadata.distance, 10),
            slug: slug,
            searchContent: searchContent,
            content: content
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
        const plainTextDesc = node.content.Beginner.replace(/<[^>]+>/g, '').substring(0, 150).trim();
        
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

            <!-- Interactive Tier Tabs Selector -->
            <div class="tier-tabs-container">
                <div class="tier-tabs">
                    <button class="tier-tab active" data-tier="beginner">Beginner Overview</button>
                    ${node.content.Intermediate ? `<button class="tier-tab" data-tier="intermediate">Intermediate Deep Dive</button>` : ''}
                    ${node.content.Advanced ? `<button class="tier-tab" data-tier="advanced">Advanced Technical</button>` : ''}
                </div>
            </div>

            <div class="tier-content-wrapper">
                <div class="tier-content active" id="tier-beginner">
                    <section class="content-tier drop-cap-section" id="overview">
                        <h2 class="tier-header">${node.name} — Overview</h2>
                        ${node.content.Beginner}
                    </section>
                </div>

                ${node.content.Intermediate ? `
                <div class="tier-content" id="tier-intermediate" style="display: none;">
                    <section class="content-tier" id="deeper-dive">
                        <h2 class="tier-header">Deeper Dive</h2>
                        ${node.content.Intermediate}
                    </section>
                </div>` : ''}

                ${node.content.Advanced ? `
                <div class="tier-content" id="tier-advanced" style="display: none;">
                    <section class="content-tier" id="technical-details">
                        <h2 class="tier-header">Technical Details</h2>
                        ${node.content.Advanced}
                    </section>
                </div>` : ''}
            </div>
        </article>

        <aside class="sidebar">
            <div class="sidebar-card">
                <h3 class="sidebar-title">On This Page</h3>
                <ul class="toc-list">
                    <li><a href="#beginner" class="active">Overview</a></li>
                    ${node.content.Intermediate ? `<li><a href="#intermediate">Deeper Dive</a></li>` : ''}
                    ${node.content.Advanced ? `<li><a href="#advanced">Technical Details</a></li>` : ''}
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
    </main>

    <!-- Client-side Tab Switcher Script -->
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const tabs = document.querySelectorAll(".tier-tab");
            const contents = document.querySelectorAll(".tier-content");
            const tocLinks = document.querySelectorAll(".toc-list a");

            function switchTier(tierId) {
                tabs.forEach(tab => {
                    tab.classList.toggle("active", tab.dataset.tier === tierId);
                });
                contents.forEach(content => {
                    if (content.id === \`tier-\${tierId}\`) {
                        content.style.display = "block";
                        content.classList.add("active");
                    } else {
                        content.style.display = "none";
                        content.classList.remove("active");
                    }
                });
                
                // Highlight active link in TOC
                tocLinks.forEach(link => {
                    const href = link.getAttribute("href");
                    if (href === \`#\${tierId}\`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }

            tabs.forEach(tab => {
                tab.addEventListener("click", () => {
                    switchTier(tab.dataset.tier);
                });
            });

            tocLinks.forEach(link => {
                link.addEventListener("click", (e) => {
                    const href = link.getAttribute("href");
                    if (href.startsWith("#")) {
                        e.preventDefault();
                        const tierId = href.substring(1);
                        switchTier(tierId);
                        
                        // Smooth scroll to tier header
                        const targetId = tierId === 'beginner' ? 'overview' : (tierId === 'intermediate' ? 'deeper-dive' : 'technical-details');
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