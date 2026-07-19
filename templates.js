/**
 * templates.js — HTML template functions for the Neuron-IQ build pipeline.
 *
 * Contains: getArticleTemplate, getBookTemplate, getSitemapTemplate.
 *
 * Changes from original:
 *   - Removed client-side KaTeX scripts (math is rendered at build time).
 *   - Removed dead CSS from the book template (unused .book-container styles).
 *   - Templates are pure functions with no side effects.
 */

// ─── Shared Header Fragment ─────────────────────────────────────────────────

/**
 * Returns the shared <header> navigation bar HTML.
 * @param {boolean} [isSitemap=false]  If true, marks the Sitemap link as active.
 * @returns {string}
 */
function getNavHeader(isSitemap = false) {
    return `
    <header class="top-nav">
        <a href="index.html" class="brand text-gradient">Neuron-IQ</a>
        <nav class="nav-links">
            <a href="#" class="nav-link header-search-btn" id="global-search-trigger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search
            </a>
            <a href="sitemap.html" class="nav-link${isSitemap ? ' active' : ''}">Sitemap</a>
        </nav>
    </header>`;
}

// ─── Article Template ───────────────────────────────────────────────────────

/**
 * Renders a full article page for a knowledge node.
 *
 * @param {object} node           The node data object.
 * @param {string} parentLink     Href for the parent breadcrumb link.
 * @param {string} plainTextDesc  Escaped, truncated plain-text description for meta tag.
 * @param {string} breadcrumbsHTML Rendered breadcrumb trail HTML.
 * @returns {string}
 */
function getArticleTemplate(node, parentLink, plainTextDesc, breadcrumbsHTML) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#030712">
    <title>${node.name} - Neuron-IQ</title>
    <meta name="description" content="${plainTextDesc}">
    <link rel="stylesheet" href="page.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
    <script src="router.js" defer></script>
</head>
<body>
${getNavHeader(false)}

    <main class="layout-grid">
        <article class="main-content">
            <nav class="breadcrumbs">${breadcrumbsHTML}</nav>
            <div class="meta-row">
                <span class="badge category-badge">${node.category.toUpperCase()}</span>
                <span class="read-time">Distance from core: ${node.distance}</span>
            </div>
            <h1 class="article-title text-gradient">${node.name}</h1>
            <div class="article-content">
                ${node.sections
                    .map(
                        (sec) => `
                <section class="content-section content-tier" id="${sec.id}">
                    ${sec.isPreamble ? '' : `<h2 class="section-header">${sec.title}</h2>`}
                    ${sec.contentHTML}
                </section>`
                    )
                    .join('\n')}
            </div>
        </article>

        <aside class="sidebar">
            <div class="sidebar-card glass-panel">
                <h3 class="sidebar-title">On This Page</h3>
                <ul class="toc-list">
                    ${node.sections
                        .map(
                            (sec, index) =>
                                `<li><a href="#${sec.id}" class="${index === 0 ? 'active' : ''}">${sec.title}</a></li>`
                        )
                        .join('\n')}
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
}

// ─── Book (PDF) Template ────────────────────────────────────────────────────

/**
 * Renders a full-viewport PDF viewer page for a book node.
 *
 * @param {object} node           The node data object (must have node.pdf).
 * @param {string} parentLink     Href for the parent breadcrumb link.
 * @param {string} plainTextDesc  Escaped, truncated plain-text description for meta tag.
 * @param {string} breadcrumbsHTML Rendered breadcrumb trail HTML.
 * @returns {string}
 */
function getBookTemplate(node, parentLink, plainTextDesc, breadcrumbsHTML) {
    const pdfSrc = node.pdf.startsWith('http') ? node.pdf : `pdfs/${node.pdf}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#030712">
    <title>${node.name} - Neuron-IQ</title>
    <meta name="description" content="${plainTextDesc}">
    <link rel="stylesheet" href="page.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
    <script src="graph.js" defer></script>
    <script src="global.js" defer></script>
    <script src="router.js" defer></script>
</head>
<body>
${getNavHeader(false)}

    <main style="display: block; width: 100vw; height: calc(100vh - 60px); padding: 0; margin: 0; overflow: hidden; background: #fff;">
        <iframe src="${pdfSrc}" style="width: 100%; height: 100%; border: none; display: block; background: #fff;"></iframe>
    </main>
</body>
</html>`;
}

// ─── Sitemap Template ───────────────────────────────────────────────────────

/**
 * Renders the full sitemap page with category cards.
 *
 * @param {string} sitemapCategoriesHTML  Pre-rendered HTML for all category cards.
 * @returns {string}
 */
function getSitemapTemplate(sitemapCategoriesHTML) {
    return `<!DOCTYPE html>
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
${getNavHeader(true)}
    <main class="sitemap-layout">
        <h1 class="article-title sitemap-title">Knowledge Architecture</h1>
        <p class="sitemap-subtitle">A complete map of the neural database, categorized by discipline. Essential for SEO bots and curious minds.</p>
        <div class="sitemap-grid">${sitemapCategoriesHTML}</div>
    </main>
</body>
</html>`;
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
    getArticleTemplate,
    getBookTemplate,
    getSitemapTemplate,
};
