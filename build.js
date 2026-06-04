const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const markedKatex = require('marked-katex-extension'); // ADDED KATEX

// 1. Configure Marked to intercept LaTeX before parsing Markdown
marked.use(markedKatex({
    throwOnError: false // If you make a math typo, it won't crash your build
}));

const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'public');
const outputFile = path.join(outputDir, 'graph.js');

const slugify = (text) => text.toString().toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

function buildGraph() {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const graphData = {};

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

        graphData[metadata.name] = {
            ...metadata,
            distance: parseInt(metadata.distance, 10),
            slug: slug,
            searchContent: searchContent 
        };

        const parentLink = metadata.parent === 'Root' ? 'index.html' : `${slugify(metadata.parent)}.html`;
        const plainTextDesc = content.Beginner.replace(/<[^>]+>/g, '').substring(0, 150).trim();

        // ADDED THE KATEX CSS CDN TO THE HEAD
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.name} - Neuron-IQ</title>
    <meta name="description" content="${plainTextDesc}...">
    <link rel="stylesheet" href="page.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
</head>
<body>
    <header class="top-nav">
        <a href="index.html" class="brand">Neuron-IQ</a>
    </header>

    <main class="layout-grid">
        <article class="main-content">
            <nav class="breadcrumbs">
                <a href="index.html">Home</a> <span class="sep">/</span> <span>${metadata.category}</span> <span class="sep">/</span> <span class="current">${metadata.name}</span>
            </nav>

            <div class="meta-row">
                <span class="badge category-badge">${metadata.category.toUpperCase()}</span>
                <span class="read-time">Distance from core: ${metadata.distance}</span>
            </div>

            <h1 class="article-title">${metadata.name}</h1>

            <section class="content-tier drop-cap-section">
                <h2 class="tier-header">${metadata.name} — Overview</h2>
                ${content.Beginner}
            </section>

            ${content.Intermediate ? `
            <hr class="divider">
            <section class="content-tier">
                <h2 class="tier-header">Deeper Dive</h2>
                ${content.Intermediate}
            </section>` : ''}

            ${content.Advanced ? `
            <hr class="divider">
            <section class="content-tier">
                <h2 class="tier-header">Technical Details</h2>
                ${content.Advanced}
            </section>` : ''}
        </article>

        <aside class="sidebar">
            <div class="sidebar-card">
                <h3 class="sidebar-title">On This Page</h3>
                <ul class="toc-list">
                    <li><a href="#">${metadata.name} — Overview</a></li>
                    ${content.Intermediate ? `<li><a href="#">Deeper Dive</a></li>` : ''}
                    ${content.Advanced ? `<li><a href="#">Technical Details</a></li>` : ''}
                </ul>
                <hr class="sidebar-divider">
                <h3 class="sidebar-title">Lineage</h3>
                <ul class="toc-list">
                    <li><strong>Parent Concept:</strong> <br> <a href="${parentLink}" class="parent-link">← ${metadata.parent}</a></li>
                </ul>
            </div>
        </aside>
    </main>
</body>
</html>`;

        fs.writeFileSync(path.join(outputDir, `${slug}.html`), htmlContent.trim());
    });

    const outputContent = `// AUTO-GENERATED BY BUILD.JS\nwindow.NeuronMap = ${JSON.stringify(graphData, null, 2)};`;
    fs.writeFileSync(outputFile, outputContent);
    console.log(`[Neuron-IQ] SEO Build complete! Processed ${files.length} pages with KaTeX support.`);
}

buildGraph();