// floating-bg.js - Universal Animated Floating Numbers Background
(function() {
    function initFloatingBg() {
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
            numEl.style.left = `${Math.random() * 100}vw`;
            
            // Randomize duration between 15s and 35s
            const dur = 15 + Math.random() * 20;
            numEl.style.animationDuration = `${dur}s`;
            numEl.style.animationDelay = `-${Math.random() * dur}s`;
            
            container.appendChild(numEl);

            // Re-randomize horizontal position on loop
            numEl.addEventListener('animationiteration', () => {
                numEl.textContent = Math.floor(Math.random() * 9) + 1;
                numEl.style.left = `${Math.random() * 100}vw`;
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
