document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById('search-bar');
    const searchWrapper = document.getElementById('search-wrapper');
    const typewriter = document.getElementById('typewriter');
    const enterHint = document.getElementById('enter-hint');
    const dots = document.getElementById('loading-dots');
    const panel = document.getElementById('plausibility-panel');
    const cardsContainer = document.getElementById('cards-container');
    const medianVal = document.getElementById('median-val');
    const svgLayer = document.getElementById('svg-layer');
    const nodesLayer = document.getElementById('nodes-layer');
    
    // --- MODULE 1: Infinite Canvas (Pan & Zoom) ---
    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;
    const graphContainer = document.getElementById('graph-container');

    graphContainer.style.cursor = 'grab';
    graphContainer.style.pointerEvents = 'auto'; 

    graphContainer.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('node')) return; 
        isDragging = true;
        graphContainer.style.cursor = 'grabbing';
        startX = e.pageX - translateX;
        startY = e.pageY - translateY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        graphContainer.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.pageX - startX;
        translateY = e.pageY - startY;

        svgLayer.style.transform = `translate(${translateX}px, ${translateY}px)`;
        nodesLayer.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });

    let renderedNodes = {};

    // Category Colors
    const getCategoryColor = (cat) => {
        if (!cat) return 'var(--color-root)';
        const c = cat.toLowerCase();
        if (c.includes('cs') || c.includes('computer')) return 'var(--color-cs)';
        if (c.includes('math')) return 'var(--color-math)';
        if (c.includes('physics')) return 'var(--color-physics)';
        return 'var(--color-science)';
    };

    // --- MODULE 2: Landing Interface & Typewriter ---
    const queries = [
        "Understand 'Quantum Superposition'",
        "Explore 'General Relativity'",
        "Learn about 'Neural Networks'",
        "Discover 'Eigenvectors'",
        "Dive into 'Thermodynamics'"
    ];

    let queryIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingTimer;

    function typeEffect() {
        const currentQuery = queries[queryIdx];

        if (isDeleting) {
            typewriter.textContent = currentQuery.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriter.textContent = currentQuery.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 30 : 60 + Math.random() * 40;

        if (!isDeleting && charIdx === currentQuery.length) {
            typeSpeed = 2500; 
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            queryIdx = (queryIdx + 1) % queries.length; 
            typeSpeed = 500; 
        }

        typingTimer = setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();

    searchBar.addEventListener('focus', () => {
        typewriter.style.opacity = '0';
    });

    searchBar.addEventListener('blur', () => {
        if (searchBar.value.length === 0) {
            typewriter.style.opacity = '1';
        }
    });

    searchBar.addEventListener('input', () => {
        if (searchBar.value.length > 0) {
            enterHint.style.opacity = '1';
            dots.style.opacity = '0';
        } else {
            enterHint.style.opacity = '0';
            dots.style.opacity = '1';
        }
    });

searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchBar.value.trim() !== "") {
            enterHint.style.opacity = '0';
            dots.style.display = 'none';
            typewriter.style.display = 'none';

            // FULLY REMOVE HERO TEXT
            const heroText = document.getElementById('hero-text');
            if (heroText) {
                // Force the fade out, overriding the CSS animation
                heroText.style.animation = 'none'; 
                heroText.style.opacity = '0';
                
                // Completely remove it from the page flow after the fade (500ms)
                setTimeout(() => {
                    heroText.style.display = 'none';
                }, 500);
            }

            const query = searchBar.value.trim();

            searchBar.value = "";
            searchBar.classList.add('node-zero');

            setTimeout(() => {
                searchWrapper.style.opacity = '0';
                searchWrapper.style.pointerEvents = 'none';
                triggerSearchAlgorithm(query);
            }, 500);
        }
    });

    // --- MODULE 3: Contextual Fuzzy Search Algorithm ---
    function triggerSearchAlgorithm(query) {
        if (!window.NeuronMap) return console.error("No Map Data!");

        // Reset Pan/Zoom transform for new search
        translateX = 0; translateY = 0;
        svgLayer.style.transform = `translate(0px, 0px)`;
        nodesLayer.style.transform = `translate(0px, 0px)`;

        svgLayer.innerHTML = '';
        nodesLayer.innerHTML = '';
        renderedNodes = {};

        const allNodes = window.NeuronMap;
        const allNodesArray = Object.values(allNodes);
        const finalNodesToDraw = new Set();

        const fuseOptions = {
            includeScore: true,
            threshold: 0.4, 
            ignoreLocation: true, 
            keys: [
                { name: 'name', weight: 1.0 },         
                { name: 'category', weight: 0.5 },      
                { name: 'searchContent', weight: 0.3 }  
            ]
        };

        const fuse = new Fuse(allNodesArray, fuseOptions);
        const searchResults = fuse.search(query);
        
        // NEW: Map to store the relevance score of each matched node
        const scoreMap = {};

        searchResults.forEach(result => {
            finalNodesToDraw.add(result.item.name);
            const relevance = Math.max(0, Math.round((1 - result.score) * 100));
            scoreMap[result.item.name] = relevance;
        });

        const addParents = (nodeName) => {
            if (!nodeName || nodeName === 'Root') return;
            finalNodesToDraw.add(nodeName);
            const parentName = allNodes[nodeName]?.parent;
            if (parentName) addParents(parentName);
        };

        const addChildren = (nodeName) => {
            Object.values(allNodes).forEach(n => {
                if (n.parent === nodeName) finalNodesToDraw.add(n.name);
            });
        };

        [...finalNodesToDraw].forEach(name => {
            addParents(name);
            addChildren(name);
        });

        let nodesData = [];
        finalNodesToDraw.forEach(name => {
            if (allNodes[name]) nodesData.push(allNodes[name]);
        });

        if (nodesData.length === 0) {
            nodesData = allNodesArray;
        }

        // --- TREE DRAWING LOGIC (Dendrogram) ---
        
        // FIXED: Correctly establish Parent/Child map for layout calculation
        const childrenMap = {};
        nodesData.forEach(n => {
            const parentName = n.parent || 'Root';
            if (!childrenMap[parentName]) childrenMap[parentName] = [];
            childrenMap[parentName].push(n);
        });

        let currentLeafY = 0;
        const ySpacing = 100;
        const layoutMap = {};

        function calculateLayout(nodeName) {
            const children = childrenMap[nodeName] || [];
            if (children.length === 0) {
                layoutMap[nodeName] = { y: currentLeafY };
                currentLeafY += ySpacing;
                return layoutMap[nodeName].y;
            } else {
                let minChildY = Infinity;
                let maxChildY = -Infinity;
                children.forEach(child => {
                    const childY = calculateLayout(child.name);
                    minChildY = Math.min(minChildY, childY);
                    maxChildY = Math.max(maxChildY, childY);
                });
                const parentY = (minChildY + maxChildY) / 2;
                layoutMap[nodeName] = { y: parentY };
                return parentY;
            }
        }

        calculateLayout('Root');

        // Catch orphans
        nodesData.forEach(n => {
            if (!layoutMap[n.name]) {
                layoutMap[n.name] = { y: currentLeafY };
                currentLeafY += ySpacing;
            }
        });

        const startX = window.innerWidth * 0.15;
        const xStep = 250;
        const totalHeight = currentLeafY > 0 ? currentLeafY - ySpacing : 0;
        const startYOffset = (window.innerHeight / 2) - (totalHeight / 2);

        // Calculate Root safely
        const rootY = (layoutMap['Root'] ? layoutMap['Root'].y : 0) + startYOffset;
        renderedNodes['Root'] = { x: startX, y: rootY, color: 'var(--color-root)' };
        drawNodeDot(startX, rootY, `Query: "${query}"`, 'var(--color-root)');

        const distanceGroups = {};
        nodesData.forEach(n => {
            if (!distanceGroups[n.distance]) distanceGroups[n.distance] = [];
            distanceGroups[n.distance].push(n);
        });

        const sortedDistances = Object.keys(distanceGroups).sort((a, b) => a - b);

        sortedDistances.forEach((dist, i) => {
            setTimeout(() => {
                const nodes = distanceGroups[dist];

                nodes.forEach((node, index) => {
                    const nodeX = startX + (node.distance * xStep);
                    const nodeY = layoutMap[node.name].y + startYOffset;
                    const color = getCategoryColor(node.category);

                    renderedNodes[node.name] = { x: nodeX, y: nodeY, color: color };
                    const parentData = renderedNodes[node.parent] || renderedNodes['Root'];

                    drawSweepLine(parentData.x, parentData.y, nodeX, nodeY, color);
                    setTimeout(() => drawNodeDot(nodeX, nodeY, node.name, color, node, index), 200);
                });

            }, i * 600);
        });

        triggerPlausibilityEngine(nodesData, scoreMap);
    }

    // --- Drawing Utilities ---
    function drawSweepLine(x1, y1, x2, y2, color) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'path-line');
        path.style.stroke = color;
        path.style.strokeWidth = "2px";

        const offset = Math.abs(x2 - x1) * 0.5;
        const d = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
        path.setAttribute('d', d);
        svgLayer.appendChild(path);

        setTimeout(() => {
            const length = Math.ceil(path.getTotalLength()) + 20;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect();

            path.style.opacity = '0.7';
            path.style.strokeDashoffset = '0';
        }, 10);
    }

    function drawNodeDot(x, y, labelText, color, nodeObj = null, index = 0) {
        const dot = document.createElement(nodeObj ? 'a' : 'div');
        if (nodeObj) dot.href = `${nodeObj.slug}.html`;

        dot.className = 'node';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.color = color;
        dot.style.backgroundColor = color;

        const label = document.createElement('div');
        label.className = 'node-label';

        if (index % 2 !== 0) {
            label.classList.add('bottom');
        }

        label.innerText = labelText;
        dot.appendChild(label);

        nodesLayer.appendChild(dot);
        setTimeout(() => dot.style.opacity = '1', 50);
    }

    // --- MODULE 4: Plausibility Engine ---
    function triggerPlausibilityEngine(nodesData, scoreMap) {
        if (nodesData.length === 0) return;

        // 1. Sort by Relevance Score (Highest First)
        nodesData.sort((a, b) => {
            const scoreA = scoreMap[a.name] || 0;
            const scoreB = scoreMap[b.name] || 0;
            return scoreB - scoreA; // Descending order
        });

        // 2. Update Top Badge with the highest score
        const topScore = scoreMap[nodesData[0].name] || 0;
        medianVal.innerText = `${topScore}%`;

        cardsContainer.innerHTML = '';
        
        // 3. Generate Staggered Cards
        nodesData.forEach((node, index) => {
            const cardColor = getCategoryColor(node.category);
            const relevanceScore = scoreMap[node.name];
            
            // If it has a score, show %, otherwise it's just a structural context node
            const labelText = relevanceScore !== undefined 
                ? `${relevanceScore}% MATCH` 
                : `CONTEXT NODE`;

            const card = document.createElement('a');
            card.href = `${node.slug}.html`;
            card.className = 'card';
            card.style.display = 'block';
            card.style.textDecoration = 'none';
            
            card.style.animationDelay = `${index * 0.08}s`;

            card.innerHTML = `
                <div class="card-dist" style="color: ${cardColor}">${labelText}</div>
                <div class="card-title">${node.name}</div>
            `;
            cardsContainer.appendChild(card);
        });

        panel.style.right = '0';
    }
});