/**
 * Neuron-IQ Global Module
 * Centralizes reusable utilities, search algorithms, and initializes shared page logic.
 */

const NeuronUtils = {
    // --- 1. Theming & Colors ---
    getCategoryColor: (cat) => {
        if (!cat) return '#ffffff';
        const c = cat.toLowerCase();
        if (c.includes('computer') || c === 'cs') return 'var(--color-cs)';
        if (c.includes('math')) return 'var(--color-math)';
        if (c.includes('physics')) return 'var(--color-physics)';
        if (c === 'root') return 'var(--color-root)';
        return 'var(--color-science)';
    },

    // --- 2. String Helpers ---
    escapeRegExp: (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    highlightMatch: (text, query) => {
        if (!query) return text;
        const q = NeuronUtils.escapeRegExp(query);
        return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="search-highlight">$1</mark>');
    },

    // --- 3. UI Component Generators ---
    generatePopoverHTML: (data) => {
        const cat = data.category || data.group || 'concept';
        const color = NeuronUtils.getCategoryColor(cat);
        return `
            <div class="popover-header">
                <span class="popover-badge" style="border-color: ${color}; color: ${color};">${cat.toUpperCase()}</span>
                <span class="popover-dist">Distance: ${data.distance !== undefined ? data.distance : '-'}</span>
            </div>
            <div class="popover-title">${data.name}</div>
            <p class="popover-desc">${data.searchContent ? data.searchContent.substring(0, 140) + '...' : 'Explore this neural concept.'}</p>
            <div class="popover-footer" style="color: ${color}">Click to explore article →</div>
        `;
    },

    positionPopover: (popover, rect) => {
        const height = popover.offsetHeight, width = popover.offsetWidth;
        let left = rect.left + window.scrollX + (rect.width / 2) - (width / 2);
        let top = rect.top + window.scrollY - height - 12;
        left = Math.max(10, Math.min(left, window.innerWidth - width - 10));
        popover.style.left = `${left}px`;
        popover.style.top = `${top}px`;
    },

    generateResultItemHTML: (item, query, score, isHistory = false) => {
        const color = NeuronUtils.getCategoryColor(item.category);
        const titleHtml = isHistory ? item.name : NeuronUtils.highlightMatch(item.name, query);
        const badgeHtml = isHistory ? 'Viewed' : `${NeuronUtils.getRelevanceScore(item, query, score)}% Match`;
        
        // Handle gracefully if old localStorage caches lack the distance stat
        const dist = item.distance !== undefined ? item.distance : '-'; 
        
        return `
            <a href="${item.slug}.html" class="search-result-item" data-name="${item.name}">
                <div class="result-left">
                    <span class="result-title">${titleHtml}</span>
                    <span class="result-category" style="color: ${color}; border-color: ${color};">${item.category.toUpperCase()}</span>
                </div>
                <div class="result-right">
                    <span class="result-badge">d:${dist}</span>
                    <span class="result-relevance" style="background: rgba(96, 165, 250, 0.1); color: ${isHistory ? 'var(--text-muted)' : 'var(--accent)'};">${badgeHtml}</span>
                </div>
            </a>
        `;
    },

    renderHistoryList: (container) => {
        const viewed = NeuronUtils.getStorage('neuron_iq_viewed_history');
        if (viewed.length === 0) {
            container.innerHTML = `<div class="search-no-results">Type to search the neural network...</div>`;
            return false;
        }
        container.innerHTML = `
            <div class="history-section-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Recently Viewed
            </div>
            ${viewed.map(v => NeuronUtils.generateResultItemHTML(v, '', 0, true)).join('')}
        `;
        return true;
    },

    // --- 4. History Storage ---
    getStorage: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    setStorage: (key, item, filterFn) => {
        let history = NeuronUtils.getStorage(key).filter(filterFn);
        history.unshift(item);
        localStorage.setItem(key, JSON.stringify(history.slice(0, 5)));
    },
    saveSearchQuery: (query) => {
        if (query) NeuronUtils.setStorage('neuron_iq_search_history', query, q => q.toLowerCase() !== query.toLowerCase());
    },
    saveClickedNode: (node) => {
        if (node?.name) {
            NeuronUtils.setStorage('neuron_iq_viewed_history', {
                name: node.name, slug: node.slug, category: node.category || node.group, distance: node.distance
            }, item => item.name.toLowerCase() !== node.name.toLowerCase());
        }
    },
    bindClickHistory: (containerEl, inputEl) => {
        containerEl.addEventListener("click", (e) => {
            const itemEl = e.target.closest(".search-result-item");
            if (itemEl && window.NeuronMap) {
                const node = window.NeuronMap[itemEl.dataset.name];
                if (node) NeuronUtils.saveClickedNode(node);
                if (inputEl && inputEl.value.trim()) NeuronUtils.saveSearchQuery(inputEl.value.trim());
            }
        });
    },

    // --- 5. Search Engine & Scoring logic ---
    getCustomSearchScore: (item, query) => {
        if (!item || !item.name) return 0;
        const name = item.name.toLowerCase(), q = query.toLowerCase();
        
        if (name === q) return 1000;
        if (name.includes(`(${q})`)) return 950;
        
        const acronym = name.split(/[\s\-]/).map(w => w[0]).join('').replace(/[^\w]/g, '');
        if (acronym === q) return 900;
        if (name.startsWith(q)) return 850;
        if (new RegExp(`\\b${NeuronUtils.escapeRegExp(q)}\\b`, 'i').test(name)) return 800;
        
        const cat = item.category ? item.category.toLowerCase() : '';
        if (cat === q) return 700;
        
        if (item.sectionTitles?.some(t => {
            const tl = t.toLowerCase();
            return tl === q || tl.startsWith(q) || new RegExp(`\\b${NeuronUtils.escapeRegExp(q)}\\b`, 'i').test(tl);
        })) return 600;
        
        if (cat.startsWith(q)) return 500;
        if (q.length > 3 && name.includes(q)) return 400;
        if (q.length > 3 && item.sectionTitles?.some(t => t.toLowerCase().includes(q))) return 300;
        return 0;
    },

    getRelevanceScore: (item, query, fuseScore) => {
        const customScore = NeuronUtils.getCustomSearchScore(item, query);
        const map = { 1000: 100, 900: 98, 800: 95, 700: 90, 600: 85, 500: 80, 400: 70 };
        let basePercent = map[customScore] || Math.max(0, Math.round((1 - fuseScore) * 100));
        
        if (customScore > 0 && !map[customScore]) {
            basePercent = Math.min(100, basePercent + Math.round((1 - fuseScore) * 5));
        }
        return basePercent;
    },

    _fuseInstance: null,
    performSearch: (query) => {
        if (!NeuronUtils._fuseInstance && window.NeuronMap && typeof Fuse !== 'undefined') {
            NeuronUtils._fuseInstance = new Fuse(Object.values(window.NeuronMap), {
                includeScore: true, threshold: 0.4, ignoreLocation: true,
                keys: [{ name: 'name', weight: 1.0 }, { name: 'category', weight: 0.5 }, { name: 'sectionTitles', weight: 0.4 }, { name: 'searchContent', weight: 0.1 }]
            });
        }
        if (!NeuronUtils._fuseInstance) return [];

        let results = NeuronUtils._fuseInstance.search(query);
        if (query.trim().length <= 3) {
            results = results.filter(r => NeuronUtils.getCustomSearchScore(r.item, query) > 0);
        }
        return results.sort((a, b) => {
            const scoreA = NeuronUtils.getCustomSearchScore(a.item, query);
            const scoreB = NeuronUtils.getCustomSearchScore(b.item, query);
            return scoreB !== scoreA ? scoreB - scoreA : a.score - b.score;
        });
    },

    // --- 6. Reusable Keyboard Navigation Manager ---
    setupListKeyboardNav: (inputEl, containerEl, onEnterAction) => {
        let selectedIndex = -1;
        
        const highlightActive = () => {
            containerEl.querySelectorAll(".search-result-item").forEach((item, index) => {
                item.classList.toggle("focused", index === selectedIndex);
            });
        };

        containerEl.addEventListener("mousemove", (e) => {
            const itemEl = e.target.closest(".search-result-item");
            if (itemEl) {
                selectedIndex = Array.from(containerEl.querySelectorAll(".search-result-item")).indexOf(itemEl);
                highlightActive();
            }
        });

        const keydownHandler = (e) => {
            const items = containerEl.querySelectorAll(".search-result-item");
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (items.length) { selectedIndex = (selectedIndex + 1) % items.length; highlightActive(); }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (items.length) { selectedIndex = (selectedIndex - 1 + items.length) % items.length; highlightActive(); }
            } else if (e.key === "Enter") {
                e.preventDefault();
                const q = inputEl.value.trim();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    const node = window.NeuronMap?.[items[selectedIndex].dataset.name];
                    if (node) NeuronUtils.saveClickedNode(node);
                    if (q) NeuronUtils.saveSearchQuery(q);
                    items[selectedIndex].click();
                } else if (onEnterAction && q) {
                    onEnterAction(q);
                } else if (items.length > 0) {
                    items[0].click();
                }
            }
        };

        if (inputEl._navListener) inputEl.removeEventListener("keydown", inputEl._navListener);
        inputEl._navListener = keydownHandler;
        inputEl.addEventListener("keydown", keydownHandler);

        return () => { selectedIndex = -1; highlightActive(); };
    }
};

window.NeuronUtils = NeuronUtils;

// ==============================================
// GLOBAL PAGE INITIALIZATION LOGIC
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
    const map = window.NeuronMap;
    const currentNameElement = document.querySelector(".article-title");
    const currentName = currentNameElement ? currentNameElement.innerText : null;

    if (map && currentName) {
        setupDynamicLineage(map, currentName);
        setupInlineDefinitions(map, currentName);
    }

    injectSearchModal();
    setupSearchModalLogic();
    setupKatexAutoRender();
    setupTOCScrollObserver();
});

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
                    <span class="node-dist-badge" style="border-color: ${NeuronUtils.getCategoryColor(c.category)}; color: ${NeuronUtils.getCategoryColor(c.category)}">d:${c.distance}</span>
                </a>
            </li>
        `).join('');
    } else {
        childrenContainer.style.display = 'none';
    }
}

function setupInlineDefinitions(map, currentName) {
    const contentArea = document.querySelector(".main-content");
    if (!contentArea) return;

    const textNodes = [];
    const walk = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            const tag = node.parentNode.tagName.toLowerCase();
            if (['code', 'pre', 'a', 'h1', 'h2', 'h3', 'h4'].includes(tag) || 
                node.parentNode.closest('.breadcrumbs') || node.parentNode.closest('.meta-row') || node.parentNode.closest('.tier-tabs')) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    let node;
    while (node = walk.nextNode()) textNodes.push(node);

    const terms = Object.keys(map).filter(name => name.toLowerCase() !== currentName.toLowerCase()).sort((a, b) => b.length - a.length);
    if (terms.length === 0) return;

    const combinedRegex = new RegExp(`\\b(${terms.map(NeuronUtils.escapeRegExp).join('|')})\\b`, 'ig');
    const lowerCaseTerms = Object.fromEntries(terms.map(t => [t.toLowerCase(), t]));

    textNodes.forEach(textNode => {
        const text = textNode.nodeValue;
        const parent = textNode.parentNode;
        if (!parent) return;

        combinedRegex.lastIndex = 0;
        let match, lastIndex = 0, hasReplacements = false;
        const fragment = document.createDocumentFragment();

        while ((match = combinedRegex.exec(text)) !== null) {
            hasReplacements = true;
            if (match.index > lastIndex) fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));

            const originalTerm = lowerCaseTerms[match[0].toLowerCase()];
            if (originalTerm && map[originalTerm]) {
                const anchor = document.createElement('a');
                anchor.href = `${map[originalTerm].slug}.html`;
                anchor.className = 'inline-wiki-link';
                anchor.dataset.term = originalTerm;
                anchor.innerText = match[0];
                fragment.appendChild(anchor);
            } else {
                fragment.appendChild(document.createTextNode(match[0]));
            }
            lastIndex = combinedRegex.lastIndex;
        }

        if (hasReplacements) {
            if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            parent.insertBefore(fragment, textNode);
            parent.removeChild(textNode);
        }
    });

    const popover = document.createElement('div');
    popover.className = 'wiki-popover';
    document.body.appendChild(popover);
    let popoverTimeout;
    
    document.querySelectorAll('.inline-wiki-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            clearTimeout(popoverTimeout);
            const data = map[link.dataset.term];
            if (!data) return;

            popover.innerHTML = NeuronUtils.generatePopoverHTML(data);
            popover.style.display = 'block';
            NeuronUtils.positionPopover(popover, link.getBoundingClientRect());
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
                <div class="search-modal-footer"><span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to dismiss.</span></div>
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

    if (!modal || !input) return;

    const openModal = () => {
        modal.classList.add("active");
        input.value = '';
        NeuronUtils.renderHistoryList(resultsContainer);
        setTimeout(() => input.focus(), 50);
        document.body.style.overflow = 'hidden'; 
    };

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = '';
    };

    document.getElementById("global-search-trigger")?.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
    document.getElementById("close-search-modal")?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    window.addEventListener("keydown", (e) => {
        if ((e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") || (e.ctrlKey && e.key.toLowerCase() === "k")) {
            e.preventDefault();
            openModal();
        }
        if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });

    const resetModalNav = NeuronUtils.setupListKeyboardNav(input, resultsContainer);
    NeuronUtils.bindClickHistory(resultsContainer, input);

    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (!query) {
            NeuronUtils.renderHistoryList(resultsContainer);
            resetModalNav();
            return;
        }

        const results = NeuronUtils.performSearch(query).slice(0, 8);
        if (results.length === 0) {
            resultsContainer.innerHTML = `<div class="search-no-results">No concepts match your query. Try something else!</div>`;
        } else {
            resultsContainer.innerHTML = results.map(r => NeuronUtils.generateResultItemHTML(r.item, query, r.score, false)).join('');
        }
        resetModalNav();
    });
}

function setupKatexAutoRender() {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}, {left: '\\[', right: '\\]', display: true}],
            throwOnError: false
        });
    } else {
        setTimeout(setupKatexAutoRender, 200);
    }
}

function setupTOCScrollObserver() {
    const sections = Array.from(document.querySelectorAll(".toc-list a")).map(link => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
            const id = href.substring(1);
            return { link, section: document.getElementById(id === 'beginner' ? 'overview' : (id === 'intermediate' ? 'deeper-dive' : 'technical-details')) };
        }
        return null;
    }).filter(item => item && item.section);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sections.forEach(s => s.link.classList.toggle("active", s.section === entry.target));
            }
        });
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });

    sections.forEach(s => observer.observe(s.section));
}