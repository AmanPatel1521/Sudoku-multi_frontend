// floating-bg.js - Universal Animated Floating Numbers Background
(function() {
    function injectStyles() {
        if (document.getElementById('floating-bg-styles')) return;
        const style = document.createElement('style');
        style.id = 'floating-bg-styles';
        style.textContent = `
        #floating-numbers-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            pointer-events: none !important;
            z-index: 0 !important;
            overflow: hidden !important;
            transition: opacity 0.3s ease !important;
        }
        body.game-active #floating-numbers-container {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        .floating-number {
            position: absolute !important;
            top: 0 !important;
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            color: rgba(139, 92, 246, 0.22) !important;
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.15) !important;
            animation-name: float-up-universal !important;
            animation-timing-function: linear !important;
            animation-iteration-count: infinite !important;
            user-select: none !important;
            pointer-events: none !important;
            filter: blur(1.5px) !important;
            will-change: transform;
        }
        body.light-mode .floating-number {
            color: rgba(139, 92, 246, 0.4) !important;
            text-shadow: none !important;
            filter: none !important;
        }
        @keyframes float-up-universal {
            0% {
                transform: translateY(105vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-10vh) rotate(360deg);
                opacity: 0;
            }
        }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function initFloatingBg() {
        injectStyles();
        let container = document.getElementById('floating-numbers-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'floating-numbers-container';
            document.body.prepend(container);
        }
        respawnNumbers();
        setupObserver();
    }

    function respawnNumbers() {
        const container = document.getElementById('floating-numbers-container');
        if (!container) return;
        container.innerHTML = '';
        
        for (let i = 0; i < 25; i++) {
            const numEl = document.createElement('div');
            numEl.className = 'floating-number';
            numEl.textContent = Math.floor(Math.random() * 9) + 1;
            numEl.style.left = `${Math.random() * 95}vw`;
            
            // Randomize duration between 15s and 35s
            const dur = 15 + Math.random() * 20;
            numEl.style.setProperty('animation-duration', `${dur}s`, 'important');
            numEl.style.setProperty('animation-delay', `-${Math.random() * dur}s`, 'important');
            
            container.appendChild(numEl);

            // Re-randomize horizontal position on loop
            numEl.addEventListener('animationiteration', () => {
                numEl.textContent = Math.floor(Math.random() * 9) + 1;
                numEl.style.left = `${Math.random() * 95}vw`;
            });
        }
    }

    let observerSetup = false;
    function setupObserver() {
        if (observerSetup || !document.body) return;
        observerSetup = true;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isGameActive = document.body.classList.contains('game-active');
                    if (!isGameActive) {
                        respawnNumbers();
                    }
                }
            });
        });
        observer.observe(document.body, { attributes: true });
    }

    window.respawnFloatingNumbers = respawnNumbers;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingBg);
    } else {
        initFloatingBg();
    }

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) respawnNumbers();
    });
})();
