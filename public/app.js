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

    // --- MODULE 2: Landing Interface ---
    searchBar.addEventListener('input', () => {
        typewriter.style.opacity = searchBar.value.length > 0 ? '0' : '1';
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
            
            const query = searchBar.value.trim();
            
            // UI Morph Animation
            searchBar.value = "";
            searchBar.classList.add('node-zero');
            
            setTimeout(() => {
                searchWrapper.style.display = 'none';
                triggerSearchAlgorithm(query);
            }, 700);
        }
    });

    // --- MODULE 3: Contextual Search Algorithm ---
    // --- MODULE 3: Contextual Fuzzy Search Algorithm ---
    function triggerSearchAlgorithm(query) {
        if(!window.NeuronMap) return console.error("No Map Data!");

        svgLayer.innerHTML = '';
        nodesLayer.innerHTML = '';
        renderedNodes = {};

        const allNodes = window.NeuronMap;
        const allNodesArray = Object.values(allNodes);
        const finalNodesToDraw = new Set();

        // 1. Initialize Fuse.js for Fuzzy & Content Searching
        const fuseOptions = {
            includeScore: true,
            threshold: 0.4, // 0.0 is perfect match, 1.0 matches anything
            ignoreLocation: true, // Search entire text, not just the beginning
            keys: [
                { name: 'name', weight: 1.0 },          // Title match is most important
                { name: 'category', weight: 0.5 },      // Category is secondary
                { name: 'searchContent', weight: 0.3 }  // Body text match is tertiary
            ]
        };

        const fuse = new Fuse(allNodesArray, fuseOptions);
        const searchResults = fuse.search(query);

        // Add the fuzzy matches to our draw list
        searchResults.forEach(result => {
            finalNodesToDraw.add(result.item.name);
        });

        // 2. Ensure structural integrity (Add Parents)
        const addParents = (nodeName) => {
            if (!nodeName || nodeName === 'Root') return;
            finalNodesToDraw.add(nodeName);
            const parentName = allNodes[nodeName]?.parent;
            if (parentName) addParents(parentName);
        };

        // 3. Expand exploration (Add immediate Children)
        const addChildren = (nodeName) => {
            Object.values(allNodes).forEach(n => {
                if (n.parent === nodeName) finalNodesToDraw.add(n.name);
            });
        };

        // Apply Parent/Child logic to matches
        [...finalNodesToDraw].forEach(name => {
            addParents(name);
            addChildren(name);
        });

        let nodesData = [];
        finalNodesToDraw.forEach(name => {
            if (allNodes[name]) nodesData.push(allNodes[name]);
        });

        // Fallback: If no matches at all, show everything.
        if (nodesData.length === 0) {
            nodesData = allNodesArray;
        }

        // --- TREE DRAWING LOGIC (Dendrogram) ---
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

        const rootY = layoutMap['Root'].y + startYOffset;
        renderedNodes['Root'] = { x: startX, y: rootY, color: 'var(--color-root)' };
        drawNodeDot(startX, rootY, `Query: "${query}"`, 'var(--color-root)');

        const distanceGroups = {};
        nodesData.forEach(n => {
            if (!distanceGroups[n.distance]) distanceGroups[n.distance] = [];
            distanceGroups[n.distance].push(n);
        });

        const sortedDistances = Object.keys(distanceGroups).sort((a,b)=>a-b);
        
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

        triggerPlausibilityEngine(nodesData);
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

    // Added 'index = 0' to parameters
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
        
        // FIX: Alternate label positioning (even index = top, odd index = bottom)
        if (index % 2 !== 0) {
            label.classList.add('bottom');
        }

        label.innerText = labelText;
        dot.appendChild(label);

        nodesLayer.appendChild(dot);
        setTimeout(() => dot.style.opacity = '1', 50);
    }

    // --- MODULE 4: Plausibility Engine (Now uses Filtered Data) ---
    function triggerPlausibilityEngine(nodesData) {
        if(nodesData.length === 0) return;

        const distances = nodesData.map(n => n.distance).sort((a,b)=>a-b);
        const median = distances[Math.floor(distances.length / 2)];
        medianVal.innerText = parseFloat(median).toFixed(1);

        nodesData.sort((a, b) => Math.abs(a.distance - median) - Math.abs(b.distance - median));

        cardsContainer.innerHTML = '';
        nodesData.forEach(node => {
            const cardColor = getCategoryColor(node.category);
            
            const card = document.createElement('a');
            card.href = `${node.slug}.html`; 
            card.className = 'card';
            card.style.display = 'block';
            card.style.textDecoration = 'none'; 

            card.innerHTML = `
                <div class="card-dist" style="color: ${cardColor}">Distance: ${node.distance}</div>
                <div class="card-title">${node.name}</div>
            `;
            cardsContainer.appendChild(card);
        });

        panel.style.right = '0';
    }
});