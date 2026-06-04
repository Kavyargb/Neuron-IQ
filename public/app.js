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
    const graphContainer = document.getElementById('graph-container');

    // --- MODULE 1: Category Color Utilities ---
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

            // Fully remove Hero text and landing layout
            const heroText = document.getElementById('hero-text');
            if (heroText) {
                heroText.style.animation = 'none'; 
                heroText.style.opacity = '0';
                setTimeout(() => {
                    heroText.style.display = 'none';
                }, 500);
            }

            const query = searchBar.value.trim();
            searchBar.value = "";
            searchBar.classList.add('node-zero');

            const landingContainer = document.getElementById('landing-container');
            
            setTimeout(() => {
                searchWrapper.style.opacity = '0';
                searchWrapper.style.pointerEvents = 'none';
                
                // CRITICAL FIX: Disable pointer-events on landing-container so it does not block node clicks
                if (landingContainer) {
                    landingContainer.style.pointerEvents = 'none';
                    landingContainer.style.opacity = '0';
                    setTimeout(() => {
                        landingContainer.style.display = 'none';
                    }, 500);
                }

                // Show graph controls
                const controls = document.getElementById('graph-controls');
                if (controls) {
                    controls.style.display = 'flex';
                }

                triggerSearchAlgorithm(query);
            }, 500);
        }
    });

    // --- MODULE 3: Rich Hover Card Initialization ---
    const hoverCard = document.createElement("div");
    hoverCard.id = "rich-hover-card";
    hoverCard.className = "wiki-popover"; // Shared styling class
    hoverCard.style.display = "none";
    document.body.appendChild(hoverCard);

    let hoverTimeout;

    function showRichHoverCard(event, d) {
        clearTimeout(hoverTimeout);
        const color = getCategoryColor(d.group);
        
        hoverCard.innerHTML = `
            <div class="popover-header">
                <span class="popover-badge" style="border-color: ${color}; color: ${color};">${d.group.toUpperCase()}</span>
                <span class="popover-dist">Distance: ${d.distance}</span>
            </div>
            <div class="popover-title">${d.name}</div>
            <p class="popover-desc">${d.searchContent ? d.searchContent.substring(0, 140) + '...' : 'Explore this neural concept.'}</p>
            <div class="popover-footer" style="color: ${color}">Click to explore article →</div>
        `;

        hoverCard.style.display = "block";
        const rect = event.target.getBoundingClientRect();
        const cardHeight = hoverCard.offsetHeight;
        const cardWidth = hoverCard.offsetWidth;

        let left = rect.left + window.scrollX + (rect.width / 2) - (cardWidth / 2);
        let top = rect.top + window.scrollY - cardHeight - 12;

        if (left < 10) left = 10;
        if (left + cardWidth > window.innerWidth - 10) left = window.innerWidth - cardWidth - 10;

        hoverCard.style.left = `${left}px`;
        hoverCard.style.top = `${top}px`;
        
        setTimeout(() => hoverCard.classList.add("show"), 10);
    }

    function hideRichHoverCard() {
        hoverTimeout = setTimeout(() => {
            hoverCard.classList.remove("show");
            setTimeout(() => {
                if (!hoverCard.classList.contains("show")) {
                    hoverCard.style.display = "none";
                }
            }, 200);
        }, 150);
    }

    // Keep card open if hovering over the card itself
    hoverCard.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
    hoverCard.addEventListener('mouseleave', hideRichHoverCard);

    // --- MODULE 4: D3 Force Directed Graph Engine ---
    let simulation = null;
    let nodeElements = null;
    let linkElements = null;

    function triggerSearchAlgorithm(query) {
        if (!window.NeuronMap) return console.error("No Map Data!");

        // Reset layers
        svgLayer.innerHTML = '';
        nodesLayer.innerHTML = '';
        svgLayer.style.transform = 'none';
        nodesLayer.style.transform = 'none';

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
                { name: 'searchContent', weight: 0.8 }  
            ]
        };

        const fuse = new Fuse(allNodesArray, fuseOptions);
        const searchResults = fuse.search(query);
        const scoreMap = {};

        searchResults.forEach(result => {
            finalNodesToDraw.add(result.item.name);
            const relevance = Math.max(0, Math.round((1 - result.score) * 100));
            scoreMap[result.item.name] = relevance;
        });

        // Add parent lineage recursively
        const addParents = (nodeName) => {
            if (!nodeName || nodeName === 'Root') return;
            finalNodesToDraw.add(nodeName);
            const parentName = allNodes[nodeName]?.parent;
            if (parentName) addParents(parentName);
        };

        // Add immediate child concepts
        const addChildren = (nodeName) => {
            Object.values(allNodes).forEach(n => {
                if (n.parent === nodeName) finalNodesToDraw.add(n.name);
            });
        };

        [...finalNodesToDraw].forEach(name => {
            addParents(name);
            addChildren(name);
        });

        // Fallback to all nodes if search yields nothing
        let nodesData = [];
        finalNodesToDraw.forEach(name => {
            if (allNodes[name]) nodesData.push(allNodes[name]);
        });
        if (nodesData.length === 0) {
            nodesData = allNodesArray;
        }

        // Build D3 Nodes
        const nodes = nodesData.map(n => ({
            id: n.name,
            name: n.name,
            group: n.category,
            distance: n.distance,
            slug: n.slug,
            searchContent: n.searchContent
        }));

        // Add Query Center Hub
        nodes.push({
            id: 'Root',
            name: `Query: "${query}"`,
            group: 'root',
            distance: 0
        });

        // Build D3 Links
        const links = [];
        nodesData.forEach(n => {
            const hasParentInSet = nodes.some(node => node.id === n.parent);
            const sourceId = (n.parent && hasParentInSet) ? n.parent : 'Root';
            links.push({
                source: sourceId,
                target: n.name
            });
        });

        // D3 Physics Simulation
        const width = window.innerWidth;
        const height = window.innerHeight;

        simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(140))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(50))
            // Hierarchical X Positioning constraint based on depth distance
            .force("x", d3.forceX(d => {
                if (d.id === 'Root') return width * 0.15;
                return (width * 0.15) + (d.distance * 220);
            }).strength(1.2))
            .force("y", d3.forceY(height / 2).strength(0.15));

        // Render Links
        linkElements = d3.select(svgLayer).selectAll("path")
            .data(links)
            .join("path")
            .attr("class", "path-line pulsing")
            .style("stroke", d => getCategoryColor(d.target.group))
            .style("stroke-width", "2px")
            .style("stroke-dasharray", "8 12");

        // Render Nodes
        nodeElements = d3.select(nodesLayer).selectAll(".node")
            .data(nodes)
            .join("a")
            .attr("href", d => d.id === 'Root' ? null : `${d.slug}.html`)
            .attr("class", d => `node ${d.id === 'Root' ? 'root-node' : ''}`)
            .style("background-color", d => getCategoryColor(d.group))
            .style("color", d => getCategoryColor(d.group))
            .call(drag(simulation));

        // Render node labels inside nodes
        nodeElements.each(function(d) {
            const label = document.createElement('div');
            label.className = 'node-label';
            // Alternating labels bottom / top
            const idx = nodes.indexOf(d);
            if (idx % 2 !== 0) {
                label.classList.add('bottom');
            }
            label.innerText = d.name;
            this.appendChild(label);
        });

        // Node Event Binding
        nodeElements
            .on("mouseenter", (event, d) => {
                if (d.id === 'Root') return;
                showRichHoverCard(event, d);
            })
            .on("mouseleave", hideRichHoverCard)
            .on("click", (event, d) => {
                if (d.id === 'Root') return;
                window.location.href = `${d.slug}.html`;
            });

        // Simulation Update on Physics Tick
        simulation.on("tick", () => {
            linkElements.attr("d", d => {
                const x1 = d.source.x;
                const y1 = d.source.y;
                const x2 = d.target.x;
                const y2 = d.target.y;
                const offset = Math.abs(x2 - x1) * 0.5;
                return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
            });

            nodeElements
                .style("left", d => `${d.x}px`)
                .style("top", d => `${d.y}px`);
        });

        // --- Zoom & Pan Setup ---
        const zoomBehavior = d3.zoom()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
                svgLayer.style.transform = `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
                nodesLayer.style.transform = `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
            });

        d3.select(graphContainer).call(zoomBehavior);

        // Control Panel Bindings
        const zoomInBtn = document.getElementById("zoom-in");
        if (zoomInBtn) {
            zoomInBtn.onclick = () => {
                d3.select(graphContainer).transition().duration(250).call(zoomBehavior.scaleBy, 1.25);
            };
        }
        const zoomOutBtn = document.getElementById("zoom-out");
        if (zoomOutBtn) {
            zoomOutBtn.onclick = () => {
                d3.select(graphContainer).transition().duration(250).call(zoomBehavior.scaleBy, 0.8);
            };
        }
        const zoomResetBtn = document.getElementById("zoom-reset");
        if (zoomResetBtn) {
            zoomResetBtn.onclick = () => {
                d3.select(graphContainer).transition().duration(400).call(zoomBehavior.transform, d3.zoomIdentity);
            };
        }

        // Category Filter Buttons Setup
        setupFilters();

        // Populate Plausibility Sidebar Panel
        triggerPlausibilityEngine(nodesData, scoreMap);
    }

    // --- Node Drag Handler ---
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // --- Category Filter Panel logic ---
    function setupFilters() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(btn => {
            btn.onclick = () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.dataset.category;

                // Stagger fade nodes
                nodeElements.transition().duration(200)
                    .style("opacity", d => {
                        if (category === 'all' || d.id === 'Root') return 1;
                        return d.group.toLowerCase().includes(category) ? 1 : 0.15;
                    })
                    .style("pointer-events", d => {
                        if (category === 'all' || d.id === 'Root') return "auto";
                        return d.group.toLowerCase().includes(category) ? "auto" : "none";
                    });

                // Stagger fade links
                linkElements.transition().duration(200)
                    .style("opacity", d => {
                        if (category === 'all') return 0.6;
                        return d.target.group.toLowerCase().includes(category) ? 0.6 : 0.05;
                    });
            };
        });
    }

    // --- Plausibility Side Panel Drawer ---
    function triggerPlausibilityEngine(nodesData, scoreMap) {
        if (nodesData.length === 0) return;

        // Sort by relevance score desc
        nodesData.sort((a, b) => {
            const scoreA = scoreMap[a.name] || 0;
            const scoreB = scoreMap[b.name] || 0;
            return scoreB - scoreA;
        });

        // Set Top Relevance Score Badge
        const topScore = scoreMap[nodesData[0].name] || 0;
        medianVal.innerText = `${topScore}%`;

        cardsContainer.innerHTML = '';
        
        nodesData.forEach((node, index) => {
            const cardColor = getCategoryColor(node.category);
            const relevanceScore = scoreMap[node.name];
            
            const labelText = relevanceScore !== undefined 
                ? `${relevanceScore}% MATCH` 
                : `CONTEXT NODE`;

            const card = document.createElement('a');
            card.href = `${node.slug}.html`;
            card.className = 'card';
            card.style.display = 'block';
            card.style.textDecoration = 'none';
            card.style.animationDelay = `${index * 0.06}s`;

            card.innerHTML = `
                <div class="card-dist" style="color: ${cardColor}">${labelText}</div>
                <div class="card-title">${node.name}</div>
            `;
            cardsContainer.appendChild(card);
        });

        panel.style.right = '0';
    }
});