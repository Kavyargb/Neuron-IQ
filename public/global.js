/**
 * Neuron-IQ Global Module
 * Runs on every page load (Home and Article pages) to initialize shared logic.
 * Modules include: Dynamic Lineage sidebar, Inline Wikipedia-style link replacement,
 * Command Palette search modal, KaTeX auto-rendering, and TOC Scroll Intersection Observer.
 */
document.addEventListener("DOMContentLoaded", () => {
    // --- MODULE 1: Setup Shared Data and Dynamic Content ---
    const map = window.NeuronMap;
    const currentNameElement = document.querySelector(".article-title");
    const currentName = currentNameElement ? currentNameElement.innerText : null;

    if (map && currentName) {
        setupDynamicLineage(map, currentName);
        setupInlineDefinitions(map, currentName);
    }

    // --- MODULE 2: Global Search Modal (Command Palette) ---
    injectSearchModal();
    setupSearchModalLogic();

    // --- MODULE 3: KaTeX Auto-Renderer ---
    setupKatexAutoRender();

    // --- MODULE 4: TOC Scroll Observer ---
    setupTOCScrollObserver();
});

/**
 * Dynamically builds the concept lineage children sidebar.
 * Queries window.NeuronMap to find all children whose parent matches currentName,
 * sorts them alphabetically, and injects clickable list items with distance badges.
 * If no children are found, hides the sub-concepts container.
 * 
 * @param {Object} map The global NeuronMap dictionary.
 * @param {string} currentName The title of the current concept/article page.
 */
function setupDynamicLineage(map, currentName) {
    const childrenList = document.getElementById("sidebar-children-list");
    const childrenContainer = document.getElementById("lineage-children");
    if (!childrenList || !childrenContainer) return;

    // Filter nodes that declare the current node as their parent
    const children = Object.values(map).filter(n => n.parent === currentName);
    
    if (children.length > 0) {
        children.sort((a, b) => a.name.localeCompare(b.name));
        childrenList.innerHTML = children.map(c => `
            <li>
                <a href="${c.slug}.html" class="child-link">
                    ${c.name}
                    <span class="node-dist-badge" style="border-color: ${getCategoryColor(c.category)}; color: ${getCategoryColor(c.category)}">d:${c.distance}</span>
                </a>
            </li>
        `).join('');
    } else {
        // Hide sidebar section entirely if there are no sub-concepts
        childrenContainer.style.display = 'none';
    }
}

/**
 * Scan the article text nodes and insert Wikipedia-style inline links
 * for mentions of other nodes in the knowledge graph.
 * 
 * Performance design:
 * 1. Uses document.createTreeWalker to target text nodes directly.
 * 2. Filters out active tags (pre, code, a, headers, TOC, nav).
 * 3. Sorts keywords by length descending to match multi-word phrases first ("Linear Algebra" before "Algebra").
 * 4. Compiles a single combined RegExp to search nodes in O(N) instead of nested loops.
 * 5. Uses a DocumentFragment to perform DOM replacements efficiently in a single operation.
 * 
 * @param {Object} map The global NeuronMap database.
 * @param {string} currentName The current page's article name (prevent linking to self).
 */
function setupInlineDefinitions(map, currentName) {
    const contentArea = document.querySelector(".main-content");
    if (!contentArea) return;

    // Traverses the content subtree skipping elements where inline definitions would break layout/semantics
    const textNodes = [];
    const walk = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            const parent = node.parentNode;
            const tag = parent.tagName.toLowerCase();
            if (tag === 'code' || tag === 'pre' || tag === 'a' || tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || 
                parent.closest('.breadcrumbs') || parent.closest('.meta-row') || parent.closest('.tier-tabs')) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    let node;
    while (node = walk.nextNode()) {
        textNodes.push(node);
    }

    // Sort matching terms by string length descending to avoid matching parts of longer compound phrases
    const terms = Object.keys(map)
        .filter(name => name.toLowerCase() !== currentName.toLowerCase())
        .sort((a, b) => b.length - a.length);

    if (terms.length === 0) return;

    // Combine all terms into a single regex alternation with word boundaries
    const combinedRegex = new RegExp(`\\b(${terms.map(escapeRegExp).join('|')})\\b`, 'ig');

    // Fast mapping to preserve original capitalization of terms during match
    const lowerCaseTerms = {};
    terms.forEach(term => {
        lowerCaseTerms[term.toLowerCase()] = term;
    });

    textNodes.forEach(textNode => {
        const text = textNode.nodeValue;
        const parent = textNode.parentNode;
        if (!parent) return;

        combinedRegex.lastIndex = 0;
        let match;
        let lastIndex = 0;
        let hasReplacements = false;
        
        const fragment = document.createDocumentFragment();

        while ((match = combinedRegex.exec(text)) !== null) {
            hasReplacements = true;
            const matchedText = match[0];
            const index = match.index;

            // Add text preceding the matched word
            if (index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
            }

            // Map match to its original casing
            const originalTerm = lowerCaseTerms[matchedText.toLowerCase()];
            if (originalTerm && map[originalTerm]) {
                const anchor = document.createElement('a');
                anchor.href = `${map[originalTerm].slug}.html`;
                anchor.className = 'inline-wiki-link';
                anchor.dataset.term = originalTerm;
                anchor.innerText = matchedText;
                fragment.appendChild(anchor);
            } else {
                fragment.appendChild(document.createTextNode(matchedText));
            }

            lastIndex = combinedRegex.lastIndex;
        }

        if (hasReplacements) {
            // Append any remaining text after the last match
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }
            parent.insertBefore(fragment, textNode);
            parent.removeChild(textNode);
        }
    });

    // Create a single hovering popover element to show concept details on hover
    const popover = document.createElement('div');
    popover.className = 'wiki-popover';
    document.body.appendChild(popover);

    let popoverTimeout;
    
    // Bind event listeners to show popover card on link hover
    document.querySelectorAll('.inline-wiki-link').forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            clearTimeout(popoverTimeout);
            const term = link.dataset.term;
            const data = map[term];
            if (!data) return;

            const rect = link.getBoundingClientRect();
            const color = getCategoryColor(data.category);

            popover.innerHTML = `
                <div class="popover-header">
                    <span class="popover-badge" style="border-color: ${color}; color: ${color};">${data.category.toUpperCase()}</span>
                    <span class="popover-dist">Distance: ${data.distance}</span>
                </div>
                <div class="popover-title">${data.name}</div>
                <p class="popover-desc">${data.searchContent.substring(0, 150)}...</p>
                <div class="popover-footer" style="color: ${color}">Click to read full article →</div>
            `;

            popover.style.display = 'block';
            const popoverHeight = popover.offsetHeight;
            const popoverWidth = popover.offsetWidth;

            // Center-align popover horizontally above link
            let left = rect.left + window.scrollX + (rect.width / 2) - (popoverWidth / 2);
            let top = rect.top + window.scrollY - popoverHeight - 12;

            // Prevent popover from clipping screen edges
            if (left < 10) left = 10;
            if (left + popoverWidth > window.innerWidth - 10) left = window.innerWidth - popoverWidth - 10;

            popover.style.left = `${left}px`;
            popover.style.top = `${top}px`;

            setTimeout(() => popover.classList.add('show'), 20);
        });

        link.addEventListener('mouseleave', () => {
            popoverTimeout = setTimeout(() => {
                popover.classList.remove('show');
                setTimeout(() => popover.style.display = 'none', 200);
            }, 300);
        });
    });

    popover.addEventListener('mouseenter', () => clearTimeout(popoverTimeout));
    popover.addEventListener('mouseleave', () => {
        popover.classList.remove('show');
        setTimeout(() => popover.style.display = 'none', 200);
    });
}

/**
 * Escapes characters in a string for safe use in standard RegExp declarations.
 * 
 * @param {string} string Regular expression target.
 * @returns {string} Escaped string.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Injects the Command Palette Search Modal container and elements into the document.
 */
function injectSearchModal() {
    if (document.getElementById("search-modal")) return;

    const modalHTML = `
        <div id="search-modal" class="search-modal-overlay">
            <div class="search-modal-container">
                <div class="search-modal-header">
                    <svg class="search-modal-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="modal-search-input" placeholder="Type a concept name, category, or keyword..." autocomplete="off" spellcheck="false">
                    <button id="close-search-modal" title="Close Search (Esc)">ESC</button>
                </div>
                <div id="modal-search-results" class="modal-results-container"></div>
                <div class="search-modal-footer">
                    <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to dismiss.</span>
                </div>
            </div>
        </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML.trim();
    document.body.appendChild(div.firstChild);
}

/**
 * Implements keyboard events, open/close operations, search ranking logic, and history trackers
 * for the Command Palette Search Modal.
 */
function setupSearchModalLogic() {
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("modal-search-input");
    const resultsContainer = document.getElementById("modal-search-results");
    const trigger = document.getElementById("global-search-trigger");
    const closeBtn = document.getElementById("close-search-modal");

    if (!modal || !input) return;

    function openModal() {
        modal.classList.add("active");
        input.value = '';
        showModalHistory();
        setTimeout(() => input.focus(), 50);
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = '';
    }

    if (trigger) {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Toggle on '/' key or 'Ctrl+K' keyboard shortcuts
    window.addEventListener("keydown", (e) => {
        if ((e.key === "/" && document.activeElement !== input && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") ||
            (e.ctrlKey && e.key.toLowerCase() === "k")) {
            e.preventDefault();
            openModal();
        }

        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    let fuse = null;
    let selectedIndex = -1;

    // Renders the recently viewed concepts saved in localStorage
    function showModalHistory() {
        const viewed = JSON.parse(localStorage.getItem('neuron_iq_viewed_history') || '[]');
        
        if (viewed.length === 0) {
            resultsContainer.innerHTML = `<div class="search-no-results">Type to search the neural network...</div>`;
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
                <a href="${v.slug}.html" class="search-result-item" data-index="${index}">
                    <div class="result-left">
                        <span class="result-title">${v.name}</span>
                        <span class="result-category" style="color: ${color}; border-color: ${color};">${v.category.toUpperCase()}</span>
                    </div>
                    <div class="result-right">
                        <span class="result-relevance" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted);">Viewed</span>
                    </div>
                </a>
            `;
        });
        
        resultsContainer.innerHTML = html;
        
        resultsContainer.querySelectorAll(".search-result-item").forEach(item => {
            item.addEventListener("mouseenter", () => {
                selectedIndex = parseInt(item.dataset.index, 10);
                highlightActiveItem();
            });
        });
    }

    input.addEventListener("focus", () => {
        if (input.value.trim().length === 0) {
            showModalHistory();
        }
    });

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (!window.NeuronMap) return;

        if (query.length === 0) {
            showModalHistory();
            selectedIndex = -1;
            return;
        }

        // Initialize Fuse.js once
        if (!fuse) {
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
                fuse = new Fuse(allNodesArray, fuseOptions);
            } else {
                console.warn("Fuse.js not loaded yet. Retrying search...");
                return;
            }
        }

        let results = fuse.search(query);
        // Short-query optimization (prevent keyword matches on minor letters)
        if (query.trim().length <= 3) {
            results = results.filter(r => getCustomSearchScore(r.item, query) > 0);
        }

        // Custom ranking using specific word matching, acronyms, and categories
        results.sort((a, b) => {
            const scoreA = getCustomSearchScore(a.item, query);
            const scoreB = getCustomSearchScore(b.item, query);
            if (scoreB !== scoreA) {
                return scoreB - scoreA;
            }
            return a.score - b.score;
        });

        results = results.slice(0, 8); // Top 8 matches
        renderModalResults(results, query);
        selectedIndex = -1;
    });

    function renderModalResults(results, query) {
        if (results.length === 0) {
            resultsContainer.innerHTML = `<div class="search-no-results">No concepts match your query. Try something else!</div>`;
            return;
        }

        resultsContainer.innerHTML = results.map((r, index) => {
            const item = r.item;
            const color = getCategoryColor(item.category);
            const relevance = getRelevanceScore(item, query, r.score);

            return `
                <a href="${item.slug}.html" class="search-result-item" data-index="${index}">
                    <div class="result-left">
                        <span class="result-title">${highlightMatch(item.name, query)}</span>
                        <span class="result-category" style="color: ${color}; border-color: ${color};">${item.category.toUpperCase()}</span>
                    </div>
                    <div class="result-right">
                        <span class="result-badge">d:${item.distance}</span>
                        <span class="result-relevance" style="background: rgba(96, 165, 250, 0.1); color: var(--accent);">${relevance}% Match</span>
                    </div>
                </a>
            `;
        }).join('');

        resultsContainer.querySelectorAll(".search-result-item").forEach(item => {
            item.addEventListener("mouseenter", () => {
                selectedIndex = parseInt(item.dataset.index, 10);
                highlightActiveItem();
            });
        });
    }

    resultsContainer.addEventListener("click", (e) => {
        const itemEl = e.target.closest(".search-result-item");
        if (itemEl && window.NeuronMap) {
            const titleEl = itemEl.querySelector(".result-title");
            if (titleEl) {
                const nodeName = titleEl.textContent;
                const node = window.NeuronMap[nodeName];
                if (node) {
                    saveClickedNode(node);
                }
            }
            const query = input.value.trim();
            if (query.length > 0) {
                saveSearchQuery(query);
            }
        }
    });

    // Keyboard support inside command palette search
    input.addEventListener("keydown", (e) => {
        const items = resultsContainer.querySelectorAll(".search-result-item");
        if (items.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            highlightActiveItem();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            highlightActiveItem();
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                const item = items[selectedIndex];
                const titleEl = item.querySelector(".result-title");
                if (titleEl && window.NeuronMap) {
                    const nodeName = titleEl.textContent;
                    const node = window.NeuronMap[nodeName];
                    if (node) {
                        saveClickedNode(node);
                    }
                }
                const query = input.value.trim();
                if (query.length > 0) {
                    saveSearchQuery(query);
                }
                item.click();
            } else if (items.length > 0) {
                const item = items[0];
                const titleEl = item.querySelector(".result-title");
                if (titleEl && window.NeuronMap) {
                    const nodeName = titleEl.textContent;
                    const node = window.NeuronMap[nodeName];
                    if (node) {
                        saveClickedNode(node);
                    }
                }
                const query = input.value.trim();
                if (query.length > 0) {
                    saveSearchQuery(query);
                }
                item.click();
            }
        }
    });

    function highlightActiveItem() {
        const items = resultsContainer.querySelectorAll(".search-result-item");
        items.forEach((item, index) => {
            item.classList.toggle("focused", index === selectedIndex);
        });
    }
}

/**
 * Initializes and triggers KaTeX math auto-rendering for page nodes.
 * Matches dollar notation tags and replaces with formatted equation layers.
 */
function setupKatexAutoRender() {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    } else {
        // Retry shortly if scripts load asynchronously
        setTimeout(setupKatexAutoRender, 200);
    }
}

/**
 * Triggers intersection observer context matching for Table of Contents sidebar.
 * Sets the active list item class representing which section header is currently inside the focus band.
 */
function setupTOCScrollObserver() {
    const tocLinks = document.querySelectorAll(".toc-list a");
    const sections = Array.from(tocLinks)
        .map(link => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                const id = href.substring(1);
                // Map the tab/section ID correctly
                const section = document.getElementById(id === 'beginner' ? 'overview' : (id === 'intermediate' ? 'deeper-dive' : 'technical-details'));
                return { link, section };
            }
            return null;
        })
        .filter(item => item && item.section);

    if (sections.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Focus band in upper portion of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find matching section in list and toggle active class
                sections.forEach(s => {
                    const isTarget = s.section === entry.target;
                    s.link.classList.toggle("active", isTarget);
                });
            }
        });
    }, observerOptions);

    sections.forEach(s => observer.observe(s.section));
}

/**
 * Maps category fields to their exact hex coloring.
 * Exposed on window.getCategoryColor to provide central color management.
 * 
 * @param {string} cat Category text string.
 * @returns {string} Hexadecimal color code representing the category.
 */
function getCategoryColor(cat) {
    if (!cat) return '#ffffff';
    const c = cat.toLowerCase();
    if (c.includes('computer') || c === 'cs') return '#fcd34d'; // CS (Yellow)
    if (c.includes('math')) return '#fb7185'; // Math (Rose/Red)
    if (c.includes('physics')) return '#60a5fa'; // Physics (Blue)
    return '#34d399'; // Science (Green)
}

/**
 * Calculates a relevance tier score (0 to 1000) for a query string.
 * Matches exact, starts-with, contains, category names, acronyms, and section titles.
 * 
 * @param {Object} item Concept data node.
 * @param {string} query Search input string.
 * @returns {number} Custom score where higher numbers denote stronger similarity.
 */
function getCustomSearchScore(item, query) {
    if (!item || !item.name) return 0;
    const name = item.name.toLowerCase();
    const q = query.toLowerCase();
    
    // Tier 1: Exact match on name
    if (name === q) return 1000;
    
    // Tier 2: Exact acronym in parentheses, e.g., "Computer Science (CS)" matching "cs"
    if (name.includes(`(${q})`)) return 950;
    
    // Tier 3: Dynamic acronym matching, e.g., CS matching Computer Science
    const nameAcronym = name.split(/[\s\-]/).map(word => word[0]).join('').replace(/[^\w]/g, '');
    if (nameAcronym === q) return 900;
    
    // Tier 4: Starts with query
    if (name.startsWith(q)) return 850;
    
    // Tier 5: Name contains the query as a distinct word
    const wordRegex = new RegExp(`\\b${escapeRegExp(q)}\\b`, 'i');
    if (wordRegex.test(name)) return 800;
    
    // Tier 6: Category matches exactly
    const cat = item.category ? item.category.toLowerCase() : '';
    if (cat === q) return 700;
    
    // Tier 7: Match inside section titles (headers)
    if (item.sectionTitles && item.sectionTitles.some(title => {
        const t = title.toLowerCase();
        return t === q || t.startsWith(q) || new RegExp(`\\b${escapeRegExp(q)}\\b`, 'i').test(t);
    })) {
        return 600;
    }
    
    // Tier 8: Category starts with query
    if (cat.startsWith(q)) return 500;
    
    // Tier 9: Substring match in name
    if (q.length > 3 && name.includes(q)) return 400;
    
    // Tier 10: Substring match in section titles
    if (q.length > 3 && item.sectionTitles && item.sectionTitles.some(title => title.toLowerCase().includes(q))) {
        return 300;
    }
    
    return 0;
}

/**
 * Combines standard Fuse.js scores and the Custom search score tiers into a relevance percentage (0-100).
 * 
 * @param {Object} item Concept data node.
 * @param {string} query Search input string.
 * @param {number} fuseScore Standard Fuse.js match rating (0 = perfect, 1 = none).
 * @returns {number} Percentage match rating.
 */
function getRelevanceScore(item, query, fuseScore) {
    const customScore = getCustomSearchScore(item, query);
    let basePercent = 0;
    if (customScore === 1000) basePercent = 100;
    else if (customScore === 900) basePercent = 98;
    else if (customScore === 800) basePercent = 95;
    else if (customScore === 700) basePercent = 90;
    else if (customScore === 600) basePercent = 85;
    else if (customScore === 500) basePercent = 80;
    else if (customScore === 400) basePercent = 70;
    else basePercent = Math.max(0, Math.round((1 - fuseScore) * 100));
    
    if (customScore > 0) {
        basePercent = Math.min(100, basePercent + Math.round((1 - fuseScore) * 5));
    }
    return basePercent;
}

/**
 * Wraps matching query strings in highlights (<mark> tags).
 * 
 * @param {string} text Target title text.
 * @param {string} query Search query string.
 * @returns {string} Text string with highlighting HTML injection.
 */
function highlightMatch(text, query) {
    if (!query) return text;
    const q = escapeRegExp(query);
    const regex = new RegExp(`(${q})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Saves the search query history in localStorage (maximum 5 items).
 * 
 * @param {string} query Search query input.
 */
function saveSearchQuery(query) {
    if (!query) return;
    let history = JSON.parse(localStorage.getItem('neuron_iq_search_history') || '[]');
    history = history.filter(q => q.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    history = history.slice(0, 5); // Keep top 5
    localStorage.setItem('neuron_iq_search_history', JSON.stringify(history));
}

/**
 * Saves details of clicked nodes inside localStorage to populate recently viewed lists.
 * 
 * @param {Object} node Concept data node.
 */
function saveClickedNode(node) {
    if (!node || !node.name) return;
    let viewed = JSON.parse(localStorage.getItem('neuron_iq_viewed_history') || '[]');
    viewed = viewed.filter(item => item.name.toLowerCase() !== node.name.toLowerCase());
    viewed.unshift({
        name: node.name,
        slug: node.slug,
        category: node.category || node.group
    });
    viewed = viewed.slice(0, 5); // Keep top 5
    localStorage.setItem('neuron_iq_viewed_history', JSON.stringify(viewed));
}

// Global Exports - Exposes variables and functions to other JavaScript files (e.g. app.js)
window.getCategoryColor = getCategoryColor;
window.getCustomSearchScore = getCustomSearchScore;
window.getRelevanceScore = getRelevanceScore;
window.highlightMatch = highlightMatch;
window.saveSearchQuery = saveSearchQuery;
window.saveClickedNode = saveClickedNode;
