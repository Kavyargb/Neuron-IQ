/**
 * Neuron-IQ Client-Side SPA Router
 * Dynamically fetches pages, updates browser history, handles View Transitions, and preloads assets.
 */

(function() {
    // Helper to load a script dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Helper to load a stylesheet dynamically
    function loadStylesheet(href) {
        if (document.querySelector(`link[href="${href}"]`)) {
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Helper to synchronize head link elements
    async function updateStylesheets(newDoc) {
        const currentLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        const newLinks = Array.from(newDoc.querySelectorAll('link[rel="stylesheet"]'));
        
        // Identify links to add (not currently in the head)
        const linksToAdd = newLinks.filter(nl => !currentLinks.some(cl => cl.getAttribute('href') === nl.getAttribute('href')));
        
        // Load the new stylesheets before switching content to prevent FOUC (flash of unstyled content)
        const loadPromises = linksToAdd.map(nl => {
            return new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = nl.getAttribute('href');
                link.onload = resolve;
                link.onerror = resolve; // Do not block navigation if stylesheet fails to load
                document.head.appendChild(link);
            });
        });
        
        await Promise.all(loadPromises);
        
        // Remove old stylesheets that are not present on the new page
        currentLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !newLinks.some(nl => nl.getAttribute('href') === href)) {
                link.remove();
            }
        });
    }

    // Main navigation orchestrator
    window.navigateTo = async function(urlPath, pushToHistory = true) {
        try {
            const response = await fetch(urlPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const url = new URL(urlPath, window.location.href);
            const pathname = url.pathname;
            const isHome = pathname.endsWith('index.html') || pathname === '/' || pathname.endsWith('/');
            const isSitemap = pathname.endsWith('sitemap.html');

            // 1. Sync stylesheets first
            await updateStylesheets(doc);

            // 2. Pre-load specific scripts needed for this page
            if (isHome) {
                // Home page needs D3 and app.js
                if (typeof d3 === 'undefined') {
                    await loadScript('https://cdn.jsdelivr.net/npm/d3@7');
                }
                if (!window.initHomePage) {
                    await loadScript('app.js');
                }
            } else if (!isSitemap) {
                // Reading pages need KaTeX
                if (typeof katex === 'undefined') {
                    loadStylesheet('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css');
                    await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js');
                    await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js');
                }
            }

            // 3. Local DOM update function
            const performDOMUpdate = () => {
                // Update title
                document.title = doc.title;

                // Sync body classes and styling
                document.body.className = doc.body.className;
                document.body.style.cssText = doc.body.style.cssText;
                
                // Clear page-scroll lock from modals
                document.body.style.overflow = '';

                // Replace main body content
                document.body.innerHTML = doc.body.innerHTML;

                // Scroll to target hash, otherwise scroll to top
                if (url.hash) {
                    const target = document.getElementById(url.hash.substring(1));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                    }
                }
                window.scrollTo({ top: 0, behavior: 'instant' });
            };

            // 4. Post-initialization page setup
            const postInit = async () => {
                // Cleanup homepage Graph simulation if navigating away
                if (!isHome && window.cleanupHomePage) {
                    window.cleanupHomePage();
                }

                // Initialize page elements
                if (isHome) {
                    if (window.initHomePage) window.initHomePage();
                } else {
                    if (window.initGlobalPage) window.initGlobalPage();
                }
            };

            // 5. Apply transitions
            if (document.startViewTransition) {
                if (pushToHistory) {
                    history.pushState(null, '', urlPath);
                }
                document.startViewTransition(async () => {
                    performDOMUpdate();
                    await postInit();
                });
            } else {
                // Fallback manual transition
                document.body.style.transition = 'opacity 150ms ease';
                document.body.style.opacity = '0';
                setTimeout(async () => {
                    performDOMUpdate();
                    if (pushToHistory) {
                        history.pushState(null, '', urlPath);
                    }
                    document.body.style.opacity = '1';
                    await postInit();
                }, 150);
            }

        } catch (e) {
            console.warn("[Router] SPA transition failed, performing standard page load:", e);
            window.location.href = urlPath;
        }
    };

    // Hijack click events for local navigations
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Skip blank targets, special modifier clicks, external urls, and same-page hashes
        if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        // Check for same-page hash updates
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
            return;
        }

        // Perform dynamic local routing
        e.preventDefault();
        window.navigateTo(url.pathname + url.search + url.hash);
    });

    // Handle back / forward browser navigation
    window.addEventListener('popstate', () => {
        window.navigateTo(window.location.pathname + window.location.search + window.location.hash, false);
    });
})();
