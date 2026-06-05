/**
 * Neuron-IQ Homepage & Graph Engine
 */
document.addEventListener("DOMContentLoaded", () => {
    const utils = window.NeuronUtils;

    // --- DOM Elements ---
    const searchBar = document.getElementById('search-bar');
    const searchWrapper = document.getElementById('search-wrapper');
    const typewriter = document.getElementById('typewriter');
    const enterHint = document.getElementById('enter-hint');
    const dots = document.getElementById('loading-dots');
    const autocompleteDropdown = document.getElementById('landing-autocomplete');
    const svgLayer = document.getElementById('svg-layer');
    const nodesLayer = document.getElementById('nodes-layer');
    const graphContainer = document.getElementById('graph-container');
    const panel = document.getElementById('plausibility-panel');
    const cardsContainer = document.getElementById('cards-container');
    
    // --- Typewriter Animation ---
    const queries = ["Understand 'Quantum Superposition'", "Explore 'General Relativity'", "Learn about 'Neural Networks'", "Discover 'Eigenvectors'", "Dive into 'Thermodynamics'"];
    let queryIdx = 0, charIdx = 0, isDeleting = false;

    function typeEffect() {
        const currentQuery = queries[queryIdx];
        isDeleting ? charIdx-- : charIdx++;
        typewriter.textContent = currentQuery.substring(0, charIdx + (isDeleting ? -1 : 1));

        let typeSpeed = isDeleting ? 30 : 60 + Math.random() * 40;
        if (!isDeleting && charIdx === currentQuery.length) { typeSpeed = 2500; isDeleting = true; } 
        else if (isDeleting && charIdx === 0) { isDeleting = false; queryIdx = (queryIdx + 1) % queries.length; typeSpeed = 500; }
        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();

    // --- Search Autocomplete Integration ---
    utils.bindClickHistory(autocompleteDropdown, searchBar);

    const resetLandingNav = utils.setupListKeyboardNav(searchBar, autocompleteDropdown, (query) => {
        enterHint.style.opacity = '0';
        dots.style.display = 'none';
        typewriter.style.display = 'none';

        const heroText = document.getElementById('hero-text');
        if (heroText) {
            heroText.style.animation = 'none'; 
            heroText.style.opacity = '0';
            setTimeout(() => heroText.style.display = 'none', 500);
        }

        searchBar.value = "";
        searchBar.classList.add('node-zero');
        
        setTimeout(() => {
            searchWrapper.style.opacity = '0';
            searchWrapper.style.pointerEvents = 'none';
            document.getElementById('landing-container').style.opacity = '0';
            setTimeout(() => document.getElementById('landing-container').style.display = 'none', 500);
            
            document.getElementById('graph-controls').style.display = 'flex';
            triggerSearchAlgorithm(query);
        }, 500);
    });

    searchBar.addEventListener('focus', () => {
        typewriter.style.opacity = '0';
        if (!searchBar.value.trim()) {
            const hasHistory = utils.renderHistoryList(autocompleteDropdown);
            autocompleteDropdown.style.display = hasHistory ? 'flex' : 'none';
            resetLandingNav();
        }
    });

    searchBar.addEventListener('blur', () => {
        if (!searchBar.value.trim()) typewriter.style.opacity = '1';
        setTimeout(() => { if (autocompleteDropdown) autocompleteDropdown.style.display = 'none'; }, 200);
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.trim();
        if (!query) {
            enterHint.style.opacity = '0';
            dots.style.opacity = '1';
            const hasHistory = utils.renderHistoryList(autocompleteDropdown);
            autocompleteDropdown.style.display = hasHistory ? 'flex' : 'none';
            resetLandingNav();
            return;
        }

        enterHint.style.opacity = '1';
        dots.style.opacity = '0';

        const results = utils.performSearch(query).slice(0, 5);
        if (results.length === 0) {
            autocompleteDropdown.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 15px; font-size: 0.9rem;">No matches found</div>`;
        } else {
            autocompleteDropdown.innerHTML = results.map(r => utils.generateResultItemHTML(r.item, query, r.score, false)).join('');
        }
        
        autocompleteDropdown.style.display = 'flex';
        resetLandingNav();
    });

    // --- Rich Hover Cards for Graph ---
    const hoverCard = document.createElement("div");
    hoverCard.className = "wiki-popover";
    hoverCard.style.display = "none";
    document.body.appendChild(hoverCard);
    let hoverTimeout;

    function showRichHoverCard(event, d) {
        clearTimeout(hoverTimeout);
        hoverCard.innerHTML = utils.generatePopoverHTML(d);
        hoverCard.style.display = "block";
        utils.positionPopover(hoverCard, event.target.getBoundingClientRect());
        setTimeout(() => hoverCard.classList.add("show"), 10);
    }

    function hideRichHoverCard() {
        hoverTimeout = setTimeout(() => {
            hoverCard.classList.remove("show");
            setTimeout(() => { if (!hoverCard.classList.contains("show")) hoverCard.style.display = "none"; }, 200);
        }, 150);
    }
    hoverCard.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
    hoverCard.addEventListener('mouseleave', hideRichHoverCard);

    // --- D3 Force Directed Graph Engine ---
    let simulation = null, nodeElements = null, linkElements = null, resizeHandler = null;

    function triggerSearchAlgorithm(query) {
        if (!window.NeuronMap) return;
        svgLayer.innerHTML = ''; nodesLayer.innerHTML = '';
        svgLayer.style.transform = 'none'; nodesLayer.style.transform = 'none';

        const allNodes = window.NeuronMap;
        const finalNodesToDraw = new Set();
        const scoreMap = {};

        // Perform main query trace search via utility 
        const searchResults = utils.performSearch(query);
        searchResults.forEach(result => {
            finalNodesToDraw.add(result.item.name);
            scoreMap[result.item.name] = utils.getRelevanceScore(result.item, query, result.score);
        });

        // Dynamic Lineage Builders
        const addParents = (nodeName) => {
            if (!nodeName || nodeName === 'Root') return;
            finalNodesToDraw.add(nodeName);
            const parentName = allNodes[nodeName]?.parent;
            if (parentName) addParents(parentName);
        };
        const addChildren = (nodeName) => {
            Object.values(allNodes).forEach(n => { if (n.parent === nodeName) finalNodesToDraw.add(n.name); });
        };

        [...finalNodesToDraw].forEach(name => { addParents(name); addChildren(name); });

        let nodesData = [...finalNodesToDraw].map(name => allNodes[name]).filter(Boolean);
        if (nodesData.length === 0) nodesData = Object.values(allNodes);

        const nodes = nodesData.map(n => ({ ...n, id: n.name, group: n.category }));
        nodes.push({ id: 'Root', name: `Query: "${query}"`, group: 'root', distance: 0 });

        const links = [];
        nodesData.forEach(n => {
            const sourceId = (n.parent && nodes.some(node => node.id === n.parent)) ? n.parent : 'Root';
            links.push({ source: sourceId, target: n.name, isInternal: false });
            
            n.internalLinks?.forEach(targetName => {
                if (nodes.some(node => node.id === targetName) && !links.some(l => (l.source === n.name && l.target === targetName) || (l.source === targetName && l.target === n.name))) {
                    links.push({ source: n.name, target: targetName, isInternal: true });
                }
            });
        });

        nodes.forEach(node => {
            node.linkCount = links.filter(l => l.source === node.id || l.target === node.id).length;
            node.radius = node.id === 'Root' ? 20 : Math.max(6, Math.min(30, 10 + 2 * node.linkCount - 1.5 * node.distance));
            node.mass = node.radius; 
        });

        const width = window.innerWidth, height = window.innerHeight;
        const rootNode = nodes.find(d => d.id === 'Root');
        if (rootNode) { rootNode.fx = width / 2; rootNode.fy = height / 2; }

        const pillars = nodes.filter(d => d.distance === 1);
        const R1 = 180; 
        pillars.forEach((d, i) => {
            const angle = (2 * Math.PI * i) / pillars.length;
            d.fx = (width / 2) + R1 * Math.cos(angle);
            d.fy = (height / 2) + R1 * Math.sin(angle);
        });

        simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.isInternal ? 160 : 120).strength(1))
            .force("charge", d3.forceManyBody().strength(-10))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => d.radius + 15))
            .force("radial", d3.forceRadial(d => d.id === 'Root' ? 0 : R1 + Math.max(0, d.distance - 1) * 150, width / 2, height / 2).strength(0.8));

        linkElements = d3.select(svgLayer).selectAll("path").data(links).join("path")
            .attr("class", d => d.isInternal ? "path-line internal-link" : "path-line pulsing")
            .style("stroke", d => d.isInternal ? "rgba(255, 255, 255, 0.12)" : utils.getCategoryColor(d.target.group))
            .style("stroke-width", d => d.isInternal ? "1px" : "2px")
            .style("stroke-dasharray", d => d.isInternal ? "3 4" : "8 12");

        nodeElements = d3.select(nodesLayer).selectAll(".node").data(nodes).join("a")
            .attr("href", d => d.id === 'Root' ? null : `${d.slug}.html`)
            .attr("class", d => `node ${d.id === 'Root' ? 'root-node' : ''}`)
            .style("background-color", d => utils.getCategoryColor(d.group))
            .style("color", d => utils.getCategoryColor(d.group))
            .style("width", d => `${d.radius * 2}px`)
            .style("height", d => `${d.radius * 2}px`)
            .call(d3.drag().on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
                           .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
                           .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); if (d.id !== 'Root' && d.distance !== 1) { d.fx = null; d.fy = null; }}));

        nodeElements.each(function(d, idx) {
            const label = document.createElement('div');
            label.className = `node-label ${idx % 2 !== 0 ? 'bottom' : ''}`;
            label.innerText = d.name;
            this.appendChild(label);
        });

        nodeElements.on("mouseenter", (event, d) => { if (d.id !== 'Root') showRichHoverCard(event, d); })
                    .on("mouseleave", hideRichHoverCard)
                    .on("click", (event, d) => { if (d.id !== 'Root') { utils.saveClickedNode(d); window.location.href = `${d.slug}.html`; }});

        simulation.on("tick", () => {
            nodes.forEach(d => { if (d.fx === null) { d.x += d.vx * (1 / d.mass - 1); d.y += d.vy * (1 / d.mass - 1); d.vx /= d.mass; d.vy /= d.mass; } });
            linkElements.attr("d", d => `M ${d.source.x} ${d.source.y} C ${d.source.x + Math.abs(d.target.x - d.source.x) * 0.5} ${d.source.y}, ${d.target.x - Math.abs(d.target.x - d.source.x) * 0.5} ${d.target.y}, ${d.target.x} ${d.target.y}`);
            nodeElements.style("left", d => `${d.x}px`).style("top", d => `${d.y}px`);
        });

        // Setup Zoom & Filters
        const zoomBehavior = d3.zoom().scaleExtent([0.3, 3]).on("zoom", (e) => {
            svgLayer.style.transform = `translate(${e.transform.x}px, ${e.transform.y}px) scale(${e.transform.k})`;
            nodesLayer.style.transform = `translate(${e.transform.x}px, ${e.transform.y}px) scale(${e.transform.k})`;
        });
        d3.select(graphContainer).call(zoomBehavior);
        
        document.getElementById("zoom-in").onclick = () => d3.select(graphContainer).transition().duration(250).call(zoomBehavior.scaleBy, 1.25);
        document.getElementById("zoom-out").onclick = () => d3.select(graphContainer).transition().duration(250).call(zoomBehavior.scaleBy, 0.8);
        document.getElementById("zoom-reset").onclick = () => d3.select(graphContainer).transition().duration(400).call(zoomBehavior.transform, d3.zoomIdentity);

        document.querySelectorAll(".filter-btn").forEach(btn => btn.onclick = () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filterCat = btn.dataset.category.toLowerCase();
            const isMatch = (g) => filterCat === 'all' || (g && (filterCat === 'cs' ? g.toLowerCase().includes('computer') || g.toLowerCase() === 'cs' : g.toLowerCase().includes(filterCat)));
            
            nodeElements.transition().duration(200)
                .style("opacity", d => (filterCat === 'all' || d.id === 'Root' || isMatch(d.group)) ? 1 : 0.15)
                .style("pointer-events", d => (filterCat === 'all' || d.id === 'Root' || isMatch(d.group)) ? "auto" : "none");
            linkElements.transition().duration(200).style("opacity", d => (filterCat === 'all' || isMatch(d.target.group)) ? 0.6 : 0.05);
        });

        // Trigger Sidebar Updates
        if (nodesData.length > 0) {
            nodesData.sort((a, b) => (scoreMap[b.name] || 0) - (scoreMap[a.name] || 0));
            document.getElementById('median-val').innerText = `${scoreMap[nodesData[0].name] || 0}%`;
            cardsContainer.innerHTML = nodesData.map((node, i) => `
                <a href="${node.slug}.html" class="card" style="display:block; text-decoration:none; animation-delay:${i * 0.06}s">
                    <div class="card-dist" style="color: ${utils.getCategoryColor(node.category)}">${scoreMap[node.name] !== undefined ? scoreMap[node.name]+'% MATCH' : 'CONTEXT NODE'}</div>
                    <div class="card-title">${node.name}</div>
                </a>
            `).join('');
            panel.style.right = '0';
        }
    }
});