/**
 * Neuron-IQ Homepage & Graph Engine
 * Initializes the landing page interactive elements and builds the D3 force-directed knowledge graph.
 */
document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
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
    /**
     * Resolves node category strings to color specifications.
     * Uses window.getCategoryColor with a fallback override for the virtual Root hub.
     * 
     * @param {string} cat Category text string.
     * @returns {string} Hex or CSS variable representing the category color.
     */
    const getCategoryColor = (cat) => {
        if (!cat || cat.toLowerCase() === 'root') return 'var(--color-root)';
        return window.getCategoryColor(cat);
    };

    /**
     * Helper to verify if a node's group matches the active category filter selection.
     * 
     * @param {string} group The node's category/group.
     * @param {string} filterCategory The currently selected filter string.
     * @returns {boolean} True if the node belongs to the filter category.
     */
    const isCategoryMatch = (group, filterCategory) => {
        if (!group) return false;
        const g = group.toLowerCase();
        const f = filterCategory.toLowerCase();
        if (f === 'all') return true;
        if (f === 'cs') return g.includes('computer') || g === 'cs';
        if (f === 'math') return g.includes('math');
        if (f === 'physics') return g.includes('physics');
        return g.includes(f);
    };

    let resizeHandler = null;

    // --- MODULE 2: Landing Interface & Typewriter ---
    // Queries cycled in the landing hero typewriter container
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

    /**
     * Recursive typewriter animation loop that types and deletes query hints
     * inside the landing search input wrapper.
     */
    function typeEffect() {
        const currentQuery = queries[queryIdx];

        if (isDeleting) {
            typewriter.textContent = currentQuery.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriter.textContent = currentQuery.substring(0, charIdx + 1);
            charIdx++;
        }

        // Variable speed: faster deletes, randomized organic typing speeds
        let typeSpeed = isDeleting ? 30 : 60 + Math.random() * 40;

        if (!isDeleting && charIdx === currentQuery.length) {
            typeSpeed = 2500; // Pause at full string
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            queryIdx = (queryIdx + 1) % queries.length; 
            typeSpeed = 500; 
        }

        typingTimer = setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();

    const autocompleteDropdown = document.getElementById('landing-autocomplete');
    let autocompleteSelectedIndex = -1;
    let landingFuse = null;

    /**
     * Renders search history items inside the autocomplete container on input focus.
     */
    function showLandingHistory() {
        if (!autocompleteDropdown) return;
        const viewed = JSON.parse(localStorage.getItem('neuron_iq_viewed_history') || '[]');
        
        if (viewed.length === 0) {
            autocompleteDropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        html += `<div class="history-section-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="history-icon" style="vertical-align: middle; margin-right: 4px;"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Recently Viewed
        </div>`;
        viewed.forEach((v, index) => {
            const color = getCategoryColor(v.category);
            html += `
                <a href="${v.slug}.html" class="autocomplete-item history-item" data-index="${index}">
                    <div class="autocomplete-left">
                        <span class="autocomplete-title">${v.name}</span>
                        <span class="autocomplete-category" style="color: ${color}; border-color: ${color};">${v.category.toUpperCase()}</span>
                    </div>
                    <div class="autocomplete-right">
                        <span class="autocomplete-relevance" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted);">Viewed</span>
                    </div>
                </a>
            `;
        });
        
        autocompleteDropdown.innerHTML = html;
        autocompleteDropdown.style.display = 'flex';
        
        autocompleteDropdown.querySelectorAll(".autocomplete-item").forEach(item => {
            item.addEventListener("mouseenter", () => {
                autocompleteSelectedIndex = parseInt(item.dataset.index, 10);
                highlightActiveAutocompleteItem();
            });
        });
    }

    /**
     * Toggles CSS focus highlights on currently selected autocomplete links.
     */
    function highlightActiveAutocompleteItem() {
        if (!autocompleteDropdown) return;
        const items = autocompleteDropdown.querySelectorAll(".autocomplete-item");
        items.forEach((item, index) => {
            item.classList.toggle("focused", index === autocompleteSelectedIndex);
        });
    }

    searchBar.addEventListener('focus', () => {
        typewriter.style.opacity = '0';
        if (searchBar.value.trim().length === 0) {
            showLandingHistory();
        }
    });

    searchBar.addEventListener('blur', () => {
        if (searchBar.value.length === 0) {
            typewriter.style.opacity = '1';
        }
        // Delayed hides allow click event delegations to fire first
        setTimeout(() => {
            if (autocompleteDropdown) {
                autocompleteDropdown.style.display = 'none';
            }
        }, 200);
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.trim();
        if (query.length > 0) {
            enterHint.style.opacity = '1';
            dots.style.opacity = '0';
        } else {
            enterHint.style.opacity = '0';
            dots.style.opacity = '1';
            showLandingHistory();
            autocompleteSelectedIndex = -1;
            return;
        }

        if (!window.NeuronMap) return;

        // Initialize homepage Fuse instance
        if (!landingFuse) {
            const allNodesArray = Object.values(window.NeuronMap);
            const fuseOptions = {
                includeScore: true,
                threshold: 0.4,
                ignoreLocation: true,
                keys: [
                    { name: 'name', weight: 1.0 },
                    { name: 'category', weight: 0.5 },
                    { name: 'sectionTitles', weight: 0.4 },
                    { name: 'searchContent', weight: 0.1 }
                ]
            };
            if (typeof Fuse !== 'undefined') {
                landingFuse = new Fuse(allNodesArray, fuseOptions);
            } else {
                return;
            }
        }

        // Retrieve search helpers exported on window scope
        const getCustomSearchScore = window.getCustomSearchScore;
        const getRelevanceScore = window.getRelevanceScore;
        const highlightMatch = window.highlightMatch;

        let results = landingFuse.search(query);
        if (query.trim().length <= 3) {
            results = results.filter(r => getCustomSearchScore(r.item, query) > 0);
        }
        results.sort((a, b) => {
            const scoreA = getCustomSearchScore(a.item, query);
            const scoreB = getCustomSearchScore(b.item, query);
            if (scoreB !== scoreA) {
                return scoreB - scoreA;
            }
            return a.score - b.score;
        });
        
        results = results.slice(0, 5); // Display top 5 matches
        
        if (results.length === 0) {
            autocompleteDropdown.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 15px; font-size: 0.9rem;">No matches found</div>`;
            autocompleteDropdown.style.display = 'flex';
            autocompleteSelectedIndex = -1;
            return;
        }

        autocompleteDropdown.innerHTML = results.map((r, index) => {
            const item = r.item;
            const color = getCategoryColor(item.category);
            const relevance = getRelevanceScore(item, query, r.score);
            return `
                <a href="${item.slug}.html" class="autocomplete-item" data-index="${index}">
                    <div class="autocomplete-left">
                        <span class="autocomplete-title">${highlightMatch(item.name, query)}</span>
                        <span class="autocomplete-category" style="color: ${color}; border-color: ${color};">${item.category.toUpperCase()}</span>
                    </div>
                    <div class="autocomplete-right">
                        <span class="autocomplete-badge">d:${item.distance}</span>
                        <span class="autocomplete-relevance" style="background: rgba(96, 165, 250, 0.1); color: var(--accent);">${relevance}% Match</span>
                    </div>
                </a>
            `;
        }).join('');
        autocompleteDropdown.style.display = 'flex';
        autocompleteSelectedIndex = -1;

        autocompleteDropdown.querySelectorAll(".autocomplete-item").forEach(item => {
            item.addEventListener("mouseenter", () => {
                autocompleteSelectedIndex = parseInt(item.dataset.index, 10);
                highlightActiveAutocompleteItem();
            });
        });
    });

    if (autocompleteDropdown) {
        autocompleteDropdown.addEventListener("click", (e) => {
            const itemEl = e.target.closest(".autocomplete-item");
            if (itemEl && window.NeuronMap) {
                const titleEl = itemEl.querySelector(".autocomplete-title");
                if (titleEl) {
                    const nodeName = titleEl.textContent;
                    const node = window.NeuronMap[nodeName];
                    if (node && window.saveClickedNode) {
                        window.saveClickedNode(node);
                    }
                }
            }
        });
    }

    searchBar.addEventListener('keydown', (e) => {
        if (!autocompleteDropdown) return;
        const items = autocompleteDropdown.querySelectorAll(".autocomplete-item");

        if (e.key === "ArrowDown" && items.length > 0) {
            e.preventDefault();
            autocompleteSelectedIndex = (autocompleteSelectedIndex + 1) % items.length;
            highlightActiveAutocompleteItem();
        } else if (e.key === "ArrowUp" && items.length > 0) {
            e.preventDefault();
            autocompleteSelectedIndex = (autocompleteSelectedIndex - 1 + items.length) % items.length;
            highlightActiveAutocompleteItem();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchBar.value.trim();
            if (query === "") return;

            // Direct autocomplete navigation if selected
            if (autocompleteSelectedIndex >= 0 && autocompleteSelectedIndex < items.length) {
                const item = items[autocompleteSelectedIndex];
                const titleEl = item.querySelector(".autocomplete-title");
                if (titleEl && window.NeuronMap) {
                    const nodeName = titleEl.textContent;
                    const node = window.NeuronMap[nodeName];
                    if (node && window.saveClickedNode) {
                        window.saveClickedNode(node);
                    }
                }
                if (window.saveSearchQuery) {
                    window.saveSearchQuery(query);
                }
                item.click();
                return;
            }

            enterHint.style.opacity = '0';
            dots.style.display = 'none';
            typewriter.style.display = 'none';

            // Dismiss landing layout
            const heroText = document.getElementById('hero-text');
            if (heroText) {
                heroText.style.animation = 'none'; 
                heroText.style.opacity = '0';
                setTimeout(() => {
                    heroText.style.display = 'none';
                }, 500);
            }

            searchBar.value = "";
            searchBar.classList.add('node-zero');

            const landingContainer = document.getElementById('landing-container');
            if (window.saveSearchQuery) {
                window.saveSearchQuery(query);
            }

            setTimeout(() => {
                searchWrapper.style.opacity = '0';
                searchWrapper.style.pointerEvents = 'none';
                
                // Allow node clicks on container fadeout
                if (landingContainer) {
                    landingContainer.style.pointerEvents = 'none';
                    landingContainer.style.opacity = '0';
                    setTimeout(() => {
                        landingContainer.style.display = 'none';
                    }, 500);
                }

                // Show D3 controls
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
    hoverCard.className = "wiki-popover";
    hoverCard.style.display = "none";
    document.body.appendChild(hoverCard);

    let hoverTimeout;

    /**
     * Renders detailed concept popover above active graph node.
     * 
     * @param {Object} event Node hover trigger event.
     * @param {Object} d Matched D3 data node properties.
     */
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

    hoverCard.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
    hoverCard.addEventListener('mouseleave', hideRichHoverCard);

    // --- MODULE 4: D3 Force Directed Graph Engine ---
    let simulation = null;
    let nodeElements = null;
    let linkElements = null;

    /**
     * Core D3 Graph layout engine. Performs Fuse.js searching, maps lineage paths,
     * and initializes force fields (collision, radial, centers, charges) on SVG elements.
     * 
     * Forces breakdown:
     * 1. link: Holds connected parent-child nodes at controlled spring distances (120-160px).
     * 2. charge: Electrostatic repulsion (-10 strength) keeps nodes from collapsing.
     * 3. center: Anchors graph coordinates around viewport center.
     * 4. collision: Prevents overlapping orbs by creating boundary radius buffer space.
     * 5. radial: Sets targeted layout distance levels from center based on concept distance.
     * 
     * @param {string} query User search term.
     */
    function triggerSearchAlgorithm(query) {
        if (!window.NeuronMap) return console.error("No Map Data!");

        // Flush canvas layers
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
                { name: 'sectionTitles', weight: 0.4 },
                { name: 'searchContent', weight: 0.1 }  
            ]
        };

        const fuse = new Fuse(allNodesArray, fuseOptions);
        let searchResults = fuse.search(query);
        
        const getCustomSearchScore = window.getCustomSearchScore;
        const getRelevanceScore = window.getRelevanceScore;

        if (query.trim().length <= 3) {
            searchResults = searchResults.filter(r => getCustomSearchScore(r.item, query) > 0);
        }

        const scoreMap = {};

        searchResults.forEach(result => {
            finalNodesToDraw.add(result.item.name);
            const relevance = getRelevanceScore(result.item, query, result.score);
            scoreMap[result.item.name] = relevance;
        });

        // Dynamic lineage addition helper (Recursively walks up to virtual Root)
        const addParents = (nodeName) => {
            if (!nodeName || nodeName === 'Root') return;
            finalNodesToDraw.add(nodeName);
            const parentName = allNodes[nodeName]?.parent;
            if (parentName) addParents(parentName);
        };

        // Concept children query helper (Finds immediate sub-concepts)
        const addChildren = (nodeName) => {
            Object.values(allNodes).forEach(n => {
                if (n.parent === nodeName) finalNodesToDraw.add(n.name);
            });
        };

        [...finalNodesToDraw].forEach(name => {
            addParents(name);
            addChildren(name);
        });

        // Fallback display if query matches nothing
        let nodesData = [];
        finalNodesToDraw.forEach(name => {
            if (allNodes[name]) nodesData.push(allNodes[name]);
        });
        if (nodesData.length === 0) {
            nodesData = allNodesArray;
        }

        // Map layout nodes parameters
        const nodes = nodesData.map(n => ({
            id: n.name,
            name: n.name,
            group: n.category,
            distance: n.distance,
            slug: n.slug,
            searchContent: n.searchContent,
            internalLinks: n.internalLinks
        }));

        // Insert Central Query node
        nodes.push({
            id: 'Root',
            name: `Query: "${query}"`,
            group: 'root',
            distance: 0
        });

        const links = [];
        
        // Setup direct parent-child connections
        nodesData.forEach(n => {
            const hasParentInSet = nodes.some(node => node.id === n.parent);
            const sourceId = (n.parent && hasParentInSet) ? n.parent : 'Root';
            links.push({
                source: sourceId,
                target: n.name,
                isInternal: false
            });
        });

        // Setup Obsidian-style cross-concept references
        nodesData.forEach(n => {
            if (n.internalLinks) {
                n.internalLinks.forEach(targetName => {
                    const targetExists = nodes.some(node => node.id === targetName);
                    if (targetExists) {
                        const linkExists = links.some(l => 
                            (l.source === n.name && l.target === targetName) || 
                            (l.source === targetName && l.target === n.name)
                        );
                        if (!linkExists) {
                            links.push({
                                source: n.name,
                                target: targetName,
                                isInternal: true
                            });
                        }
                    }
                });
            }
        });

        // Calculate node size and mass dynamics
        nodes.forEach(node => {
            const connectedLinks = links.filter(l => l.source === node.id || l.target === node.id);
            node.linkCount = connectedLinks.length;
            if (node.id === 'Root') {
                node.radius = 20;
                node.mass = 20; // Heavy inertia centers
            } else {
                node.radius = Math.max(6, Math.min(30, 10 + 2 * node.linkCount - 1.5 * node.distance));
                node.mass = node.radius; // Mass controls velocity scale
            }
        });

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Pin center node position
        const rootNode = nodes.find(d => d.id === 'Root');
        if (rootNode) {
            rootNode.fx = width / 2;
            rootNode.fy = height / 2;
        }

        // Distribute distance-1 concepts (Pillars) symmetrically in circular fashion
        const pillars = nodes.filter(d => d.distance === 1);
        const nPillars = pillars.length;
        const R1 = 180; // Distance radius limit for core pillars
        pillars.forEach((d, index) => {
            const angle = (2 * Math.PI * index) / nPillars;
            d.fx = (width / 2) + R1 * Math.cos(angle);
            d.fy = (height / 2) + R1 * Math.sin(angle);
        });

        // Initialize D3 Physics Simulator
        simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.isInternal ? 160 : 120).strength(1))
            .force("charge", d3.forceManyBody().strength(-10))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => d.radius + 15))
            .force("radial", d3.forceRadial(d => {
                if (d.id === 'Root') return 0;
                if (d.distance === 1) return R1;
                return R1 + (d.distance - 1) * 150;
            }, width / 2, height / 2).strength(0.8));

        // Coordinate resize bindings
        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler);
        }
        resizeHandler = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (simulation) {
                simulation.force("center", d3.forceCenter(w / 2, h / 2));
                simulation.force("radial", d3.forceRadial(d => {
                    if (d.id === 'Root') return 0;
                    if (d.distance === 1) return R1;
                    return R1 + (d.distance - 1) * 150;
                }, w / 2, h / 2).strength(0.8));

                const rNode = nodes.find(node => node.id === 'Root');
                if (rNode) {
                    rNode.fx = w / 2;
                    rNode.fy = h / 2;
                }

                const pNodes = nodes.filter(node => node.distance === 1);
                const nPils = pNodes.length;
                pNodes.forEach((node, index) => {
                    const angle = (2 * Math.PI * index) / nPils;
                    node.fx = (w / 2) + R1 * Math.cos(angle);
                    node.fy = (h / 2) + R1 * Math.sin(angle);
                });

                simulation.alpha(0.3).restart();
            }
        };
        window.addEventListener('resize', resizeHandler);

        // Bind SVG lines
        linkElements = d3.select(svgLayer).selectAll("path")
            .data(links)
            .join("path")
            .attr("class", d => d.isInternal ? "path-line internal-link" : "path-line pulsing")
            .style("stroke", d => d.isInternal ? "rgba(255, 255, 255, 0.12)" : getCategoryColor(d.target.group))
            .style("stroke-width", d => d.isInternal ? "1px" : "2px")
            .style("stroke-dasharray", d => d.isInternal ? "3 4" : "8 12");

        // Bind HTML elements as D3 Nodes
        nodeElements = d3.select(nodesLayer).selectAll(".node")
            .data(nodes)
            .join("a")
            .attr("href", d => d.id === 'Root' ? null : `${d.slug}.html`)
            .attr("class", d => `node ${d.id === 'Root' ? 'root-node' : ''}`)
            .style("background-color", d => getCategoryColor(d.group))
            .style("color", d => getCategoryColor(d.group))
            .style("width", d => `${d.radius * 2}px`)
            .style("height", d => `${d.radius * 2}px`)
            .call(drag(simulation));

        // Inject node text labels
        nodeElements.each(function(d) {
            const label = document.createElement('div');
            label.className = 'node-label';
            const idx = nodes.indexOf(d);
            // Alternate label positions to reduce overlap
            if (idx % 2 !== 0) {
                label.classList.add('bottom');
            }
            label.innerText = d.name;
            this.appendChild(label);
        });

        nodeElements
            .on("mouseenter", (event, d) => {
                if (d.id === 'Root') return;
                showRichHoverCard(event, d);
            })
            .on("mouseleave", hideRichHoverCard)
            .on("click", (event, d) => {
                if (d.id === 'Root') return;
                if (window.saveClickedNode) {
                    window.saveClickedNode(d);
                }
                window.location.href = `${d.slug}.html`;
            });

        // Physics updates per simulation tick
        simulation.on("tick", () => {
            // Apply Newtonian Inertia (scales velocities based on mass metric)
            nodes.forEach(d => {
                if (d.fx === null) {
                    d.x += d.vx * (1 / d.mass - 1);
                    d.y += d.vy * (1 / d.mass - 1);
                    d.vx /= d.mass;
                    d.vy /= d.mass;
                }
            });

            // Draw links using curved cubic Bezier configurations
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

        // Initialize Zoom & Pan logic
        const zoomBehavior = d3.zoom()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
                svgLayer.style.transform = `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
                nodesLayer.style.transform = `translate(${event.transform.x}px, ${event.transform.y}px) scale(${event.transform.k})`;
            });

        d3.select(graphContainer).call(zoomBehavior);

        // Bind control buttons
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

        setupFilters();
        triggerPlausibilityEngine(nodesData, scoreMap);
    }

    /**
     * Sets up active drag event handlers for node layout elements.
     * Keeps root/pillars anchored at fixed offsets during simulations.
     * 
     * @param {Object} simulation The D3 simulation context.
     * @returns {Object} D3 drag behavior registry.
     */
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
            // Protect center and pillar positions from releasing
            if (d.id !== 'Root' && d.distance !== 1) {
                d.fx = null;
                d.fy = null;
            }
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    /**
     * Initializes the category filter buttons in the control panel.
     * Selecting a category dims other nodes and links while restricting interaction.
     */
    function setupFilters() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(btn => {
            btn.onclick = () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const category = btn.dataset.category;

                // Dim non-matching nodes
                nodeElements.transition().duration(200)
                    .style("opacity", d => {
                        if (category === 'all' || d.id === 'Root') return 1;
                        return isCategoryMatch(d.group, category) ? 1 : 0.15;
                    })
                    .style("pointer-events", d => {
                        if (category === 'all' || d.id === 'Root') return "auto";
                        return isCategoryMatch(d.group, category) ? "auto" : "none";
                    });

                // Dim links matching non-active groups
                linkElements.transition().duration(200)
                    .style("opacity", d => {
                        if (category === 'all') return 0.6;
                        return isCategoryMatch(d.target.group, category) ? 0.6 : 0.05;
                    });
            };
        });
    }

    /**
     * Populates the right-hand Plausibility Sidebar Panel with ranked concept match cards.
     * 
     * @param {Array} nodesData Current nodes loaded inside the graph canvas.
     * @param {Object} scoreMap Match rating records mapped by node title.
     */
    function triggerPlausibilityEngine(nodesData, scoreMap) {
        if (nodesData.length === 0) return;

        // Sort results by similarity rating
        nodesData.sort((a, b) => {
            const scoreA = scoreMap[a.name] || 0;
            const scoreB = scoreMap[b.name] || 0;
            return scoreB - scoreA;
        });

        // Set top score badge
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