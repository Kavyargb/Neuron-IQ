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

// --- Dynamic Lineage Children Sidebar ---
function setupDynamicLineage(map, currentName) {
    const childrenList = document.getElementById("sidebar-children-list");
    const childrenContainer = document.getElementById("lineage-children");
    if (!childrenList || !childrenContainer) return;

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
        childrenContainer.style.display = 'none';
    }
}

// --- Wikipedia-style Inline Definitions ---
function setupInlineDefinitions(map, currentName) {
    const contentArea = document.querySelector(".main-content");
    if (!contentArea) return;

    // Skip technical tags and existing links to avoid breaking HTML
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

    // Sort terms by length descending to match longer multi-word phrases first
    const terms = Object.keys(map)
        .filter(name => name.toLowerCase() !== currentName.toLowerCase())
        .sort((a, b) => b.length - a.length);

    textNodes.forEach(textNode => {
        let text = textNode.nodeValue;
        let parent = textNode.parentNode;
        if (!parent) return;

        for (let i = 0; i < terms.length; i++) {
            const term = terms[i];
            // Match word boundaries, case-insensitive
            const regex = new RegExp(`\\b(${escapeRegExp(term)})\\b`, 'i');
            const match = text.match(regex);
            
            if (match) {
                const matchedText = match[0];
                const index = match.index;

                const beforeText = text.substring(0, index);
                const afterText = text.substring(index + matchedText.length);

                const beforeNode = document.createTextNode(beforeText);
                const afterNode = document.createTextNode(afterText);

                const anchor = document.createElement('a');
                anchor.href = `${map[term].slug}.html`;
                anchor.className = 'inline-wiki-link';
                anchor.dataset.term = term;
                anchor.innerText = matchedText;

                parent.insertBefore(beforeNode, textNode);
                parent.insertBefore(anchor, textNode);
                parent.insertBefore(afterNode, textNode);
                parent.removeChild(textNode);

                // Update references to scan remaining portion
                textNode = afterNode;
                text = afterText;
                break; // Break loop to avoid nested/overlapping replacements inside the same text fragment in one run
            }
        }
    });

    // Create popover element
    const popover = document.createElement('div');
    popover.className = 'wiki-popover';
    document.body.appendChild(popover);

    let popoverTimeout;
    
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

            // Compute center-aligned positioning
            let left = rect.left + window.scrollX + (rect.width / 2) - (popoverWidth / 2);
            let top = rect.top + window.scrollY - popoverHeight - 12;

            // Prevent clipping left or right edges of screen
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

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Global Search Command Palette injection ---
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

function setupSearchModalLogic() {
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("modal-search-input");
    const resultsContainer = document.getElementById("modal-search-results");
    const trigger = document.getElementById("global-search-trigger");
    const closeBtn = document.getElementById("close-search-modal");

    if (!modal || !input) return;

    function openModal() {
        modal.classList.add("active");
        resultsContainer.innerHTML = '';
        input.value = '';
        setTimeout(() => input.focus(), 50);
        document.body.style.overflow = 'hidden'; // Lock background scroll
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

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
        // Toggle on '/' key or 'Ctrl+K'
        if ((e.key === "/" && document.activeElement !== input && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") ||
            (e.ctrlKey && e.key.toLowerCase() === "k")) {
            e.preventDefault();
            openModal();
        }

        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // Search Logic with Fuse.js
    let fuse = null;
    let selectedIndex = -1;

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (!window.NeuronMap) return;

        if (query.length === 0) {
            resultsContainer.innerHTML = '';
            selectedIndex = -1;
            return;
        }

        if (!fuse) {
            const allNodesArray = Object.values(window.NeuronMap);
            const fuseOptions = {
                includeScore: true,
                threshold: 0.4,
                keys: [
                    { name: 'name', weight: 1.0 },
                    { name: 'category', weight: 0.5 },
                    { name: 'searchContent', weight: 0.3 }
                ]
            };
            // Fallback if Fuse is not loaded yet
            if (typeof Fuse !== 'undefined') {
                fuse = new Fuse(allNodesArray, fuseOptions);
            } else {
                console.warn("Fuse.js not loaded yet. Retrying search...");
                return;
            }
        }

        const results = fuse.search(query).slice(0, 8); // Top 8 matches
        renderModalResults(results);
        selectedIndex = -1;
    });

    function renderModalResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = `<div class="search-no-results">No concepts match your query. Try something else!</div>`;
            return;
        }

        resultsContainer.innerHTML = results.map((r, index) => {
            const item = r.item;
            const color = getCategoryColor(item.category);
            const relevance = Math.max(0, Math.round((1 - r.score) * 100));

            return `
                <a href="${item.slug}.html" class="search-result-item" data-index="${index}">
                    <div class="result-left">
                        <span class="result-title">${item.name}</span>
                        <span class="result-category" style="color: ${color}; border-color: ${color};">${item.category.toUpperCase()}</span>
                    </div>
                    <div class="result-right">
                        <span class="result-badge">d:${item.distance}</span>
                        <span class="result-relevance" style="background: rgba(96, 165, 250, 0.1); color: var(--accent);">${relevance}% Match</span>
                    </div>
                </a>
            `;
        }).join('');

        // Wire hover to index
        document.querySelectorAll(".search-result-item").forEach(item => {
            item.addEventListener("mouseenter", () => {
                selectedIndex = parseInt(item.dataset.index, 10);
                highlightActiveItem();
            });
        });
    }

    // Keyboard navigation in search results
    input.addEventListener("keydown", (e) => {
        const items = document.querySelectorAll(".search-result-item");
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
                items[selectedIndex].click();
            } else if (items.length > 0) {
                items[0].click();
            }
        }
    });

    function highlightActiveItem() {
        const items = document.querySelectorAll(".search-result-item");
        items.forEach((item, index) => {
            item.classList.toggle("focused", index === selectedIndex);
        });
    }
}

// --- Client-Side KaTeX Auto-Renderer ---
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

// --- Table of Contents intersection observer ---
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
        rootMargin: "-20% 0px -60% 0px", // High focus band in the middle-top of the screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find matching section in list
                sections.forEach(s => {
                    const isTarget = s.section === entry.target;
                    s.link.classList.toggle("active", isTarget);
                });
            }
        });
    }, observerOptions);

    sections.forEach(s => observer.observe(s.section));
}

// Helper: category HSL colors matching CSS styling variables
function getCategoryColor(cat) {
    if (!cat) return '#ffffff';
    const c = cat.toLowerCase();
    if (c.includes('cs') || c.includes('computer')) return '#fcd34d'; // CS (Yellow)
    if (c.includes('math')) return '#fb7185'; // Math (Rose/Red)
    if (c.includes('physics')) return '#60a5fa'; // Physics (Blue)
    return '#34d399'; // Science (Green)
}
