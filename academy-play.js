document.addEventListener('DOMContentLoaded', async () => {
    // Requires ACADEMY_LEVEL string defined in the HTML
    if (typeof ACADEMY_LEVEL === 'undefined') {
        console.error("ACADEMY_LEVEL not defined!");
        return;
    }

    const API_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:5000"
        : "https://multiplayersudoku.in/api";

    const boardEl = document.getElementById('academy-board');
    let cells = [];
    let puzzleData = null;
    let variantsEngine = null;

    // Load levels
    try {
        const res = await fetch(`${API_URL}/academy/levels`);
        const data = await res.json();
        const level = data.levels.find(l => l.id === ACADEMY_LEVEL);
        if (!level) {
            boardEl.innerHTML = "<p class='text-danger'>Level not found.</p>";
            return;
        }
        puzzleData = level;
        initBoard(level);
    } catch (e) {
        console.error("Failed to load level", e);
        boardEl.innerHTML = "<p class='text-danger'>Failed to load puzzle.</p>";
    }

    function initBoard(level) {
        boardEl.innerHTML = "";
        boardEl.style.display = "grid";
        boardEl.style.gridTemplateColumns = "repeat(9, 1fr)";
        boardEl.style.gap = "0";
        boardEl.style.width = "100%";
        boardEl.style.aspectRatio = "1 / 1";
        boardEl.style.border = "3px solid var(--text-color)";
        
        let puzzleStr = level.puzzle;
        if (Array.isArray(puzzleStr)) {
            puzzleStr = puzzleStr.flat().join('');
        }

        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'solver-cell';
            cell.dataset.index = i;
            cell.dataset.row = Math.floor(i / 9);
            cell.dataset.col = i % 9;

            // Border styling for 3x3 grids
            const row = Math.floor(i / 9);
            const col = i % 9;
            if (col % 3 === 2 && col !== 8) cell.style.borderRight = "2px solid var(--text-color)";
            if (row % 3 === 2 && row !== 8) cell.style.borderBottom = "2px solid var(--text-color)";

            // Initial value
            let val = puzzleStr[i];
            if (val !== '0' && val !== '.') {
                cell.value = val;
                cell.readOnly = true;
                cell.style.color = "var(--primary-color)";
                cell.style.fontWeight = "bold";
                cell.style.backgroundColor = "rgba(var(--bs-primary-rgb), 0.1)";
            } else {
                cell.addEventListener('input', handleInput);
                cell.addEventListener('keydown', handleKeyDown);
            }

            boardEl.appendChild(cell);
            cells.push(cell);
        }

        // Initialize Variants Engine if variant data exists
        if (level.variant_data && window.SudokuVariantsEngine) {
            variantsEngine = new SudokuVariantsEngine('.board-container');
            variantsEngine.render(level.variant_data);
        }
    }

    function handleInput(e) {
        const cell = e.target;
        const val = cell.value;
        if (!/^[1-9]$/.test(val)) {
            cell.value = '';
            cell.classList.remove('error-text');
        } else {
            // Check against solution if we want immediate feedback, 
            // or just let them fill it and check at the end.
            // Let's check at the end.
        }
        checkWinCondition();
    }

    function handleKeyDown(e) {
        const cell = e.target;
        const idx = parseInt(cell.dataset.index);
        const row = Math.floor(idx / 9);
        const col = idx % 9;

        let nextIdx = -1;
        if (e.key === 'ArrowRight') nextIdx = idx + 1;
        else if (e.key === 'ArrowLeft') nextIdx = idx - 1;
        else if (e.key === 'ArrowDown') nextIdx = idx + 9;
        else if (e.key === 'ArrowUp') nextIdx = idx - 9;

        if (nextIdx >= 0 && nextIdx < 81) {
            cells[nextIdx].focus();
            e.preventDefault();
        }
    }

    function checkWinCondition() {
        if (!puzzleData || !puzzleData.solution) return;
        
        let solStr = puzzleData.solution;
        if (Array.isArray(solStr)) {
            solStr = solStr.flat().join('');
        }

        let isComplete = true;
        let isCorrect = true;

        for (let i = 0; i < 81; i++) {
            let val = cells[i].value;
            if (!val) {
                isComplete = false;
                break;
            }
            if (val !== solStr[i].toString()) {
                isCorrect = false;
            }
        }

        if (isComplete) {
            if (isCorrect) {
                cells.forEach(c => c.style.backgroundColor = "rgba(40, 167, 69, 0.2)");
                cells.forEach(c => c.readOnly = true);
                if (window.confetti) {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
                
                // Submit progress
                let playerId = localStorage.getItem("player_id");
                if (playerId) {
                    fetch(`${API_URL}/academy/complete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            player_id: playerId,
                            level_id: ACADEMY_LEVEL,
                            score: 1000,
                            stars: 3
                        })
                    });
                }

                // Show success modal if exists
                let modalEl = document.getElementById('successModal');
                if (modalEl && window.bootstrap) {
                    let modal = new bootstrap.Modal(modalEl);
                    modal.show();
                }
            } else {
                // Highlight errors
                for (let i = 0; i < 81; i++) {
                    if (!cells[i].readOnly && cells[i].value !== solStr[i].toString()) {
                        cells[i].classList.add('text-danger');
                    } else {
                        cells[i].classList.remove('text-danger');
                    }
                }
            }
        } else {
            cells.forEach(c => c.classList.remove('text-danger'));
        }
    }
});
