// Zuia zoom kwenye Safari (iOS) na browsers zingine

export function preventZoom() {
    // 1. Zuia Ctrl+Scroll (desktop)
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });

    // 2. Zuia Ctrl+Plus/Minus (desktop)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (
            e.key === '+' || 
            e.key === '-' || 
            e.key === '=' || 
            e.key === '0'
        )) {
            e.preventDefault();
        }
    });

    // 3. Zuia gesture events (iOS Safari pinch-zoom)
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // 4. Zuia double-tap zoom (iOS Safari)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}