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

    const ACADEMY_LEVELS = [
        {
            "id": "basics",
            "title": "The Basics",
            "difficulty": "Beginner",
            "estimated_minutes": 5,
            "puzzle": "530678912672105348198342567859761423426803791713924856961537084287419635345286170",
            "solution": "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
            "type": "classic"
        },
        {
            "id": "hidden-singles",
            "title": "Hidden Singles",
            "difficulty": "Beginner",
            "estimated_minutes": 5,
            "puzzle": "504678912672095348198342567850761423426803791713924806961537284087410635345286170",
            "solution": "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
            "type": "classic"
        },
        {
            "id": "naked-pairs",
            "title": "Naked Pairs",
            "difficulty": "Intermediate",
            "estimated_minutes": 10,
            "puzzle": "504078912672095048198342567850761403426803791703924806961537284087010635345286070",
            "solution": "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
            "type": "classic"
        },
        {
            "id": "thermo",
            "title": "Thermo Sudoku",
            "difficulty": "Advanced",
            "estimated_minutes": 15,
            "puzzle": "000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "solution": "123456789456789123789123456231564897564897231897231564312978645645312978978645312",
            "type": "thermo",
            "variant_data": {
                "thermos": [
                    [[0,0], [0,1], [0,2], [0,3], [0,4]],
                    [[8,8], [7,8], [6,8]]
                ]
            }
        },
        {
            "id": "killer",
            "title": "Killer Sudoku",
            "difficulty": "Expert",
            "estimated_minutes": 20,
            "puzzle": "000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "solution": "123456789456789123789123456231564897564897231897231564312978645645312978978645312",
            "type": "killer",
            "variant_data": {
                "cages": [
                    {"sum": 3, "cells": [[0,0], [0,1]]},
                    {"sum": 15, "cells": [[1,0], [1,1], [1,2]]}
                ]
            }
        },
        {
            "id": "arrow",
            "title": "Arrow Sudoku",
            "difficulty": "Expert",
            "estimated_minutes": 20,
            "puzzle": "000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "solution": "123456789456789123789123456231564897564897231897231564312978645645312978978645312",
            "type": "arrow",
            "variant_data": {
                "arrows": [
                    {"sum_cell": [0,0], "path": [[0,1], [0,2]]}
                ]
            }
        }
    ];

    const level = ACADEMY_LEVELS.find(l => l.id === ACADEMY_LEVEL);
    if (!level) {
        boardEl.innerHTML = "<p class='text-danger'>Level not found.</p>";
        return;
    }
    puzzleData = level;
    initBoard(level);

    function initBoard(level) {
        boardEl.innerHTML = "";
        boardEl.classList.add('academy-board-active');
        
        // Add SVG Layer for custom rules
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
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('input', handleInput);
                cell.addEventListener('keydown', handleKeyDown);
            }
            
            cell.addEventListener('focus', () => selectCellAndHighlight(cell));
            cell.addEventListener('click', () => selectCellAndHighlight(cell));

            boardEl.appendChild(cell);
            cells.push(cell);
        }

        // Initialize Variants Engine if variant data exists
        if (level.variant_data && window.SudokuVariantsEngine) {
            variantsEngine = new SudokuVariantsEngine('.board-container');
            variantsEngine.render(level.variant_data);
        }
    }

    function clearHighlights() {
        cells.forEach(c => {
            c.classList.remove('highlight', 'highlight-active', 'selected');
        });
    }

    function selectCellAndHighlight(cell) {
        clearHighlights();
        
        cell.classList.add('selected');
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const boxRowStart = Math.floor(row / 3) * 3;
        const boxColStart = Math.floor(col / 3) * 3;

        cells.forEach(c => {
            const r = parseInt(c.dataset.row);
            const cl = parseInt(c.dataset.col);
            const inRow = r === row;
            const inCol = cl === col;
            const inBox = (r >= boxRowStart && r < boxRowStart + 3 && cl >= boxColStart && cl < boxColStart + 3);

            if (inRow || inCol || inBox) {
                c.classList.add('highlight');
            }
        });

        const val = cell.value;
        if (val && /^[1-9]$/.test(val)) {
            cells.forEach(c => {
                if (c.value === val) {
                    c.classList.add('highlight-active');
                }
            });
        }
    }

    function handleInput(e) {
        const cell = e.target;
        const val = cell.value;
        const idx = parseInt(cell.dataset.index);
        
        cell.classList.remove('incorrect');
        
        if (!/^[1-9]$/.test(val)) {
            cell.value = '';
            selectCellAndHighlight(cell);
        } else {
            // Check against solution for immediate feedback
            if (puzzleData && puzzleData.solution) {
                let solStr = puzzleData.solution;
                if (Array.isArray(solStr)) solStr = solStr.flat().join('');
                
                if (val !== solStr[idx].toString()) {
                    cell.classList.add('incorrect');
                    // Add shake effect
                    cell.classList.add('wrong');
                    setTimeout(() => cell.classList.remove('wrong'), 400);
                    if (window.navigator && window.navigator.vibrate) {
                        window.navigator.vibrate(200);
                    }
                }
            }
            selectCellAndHighlight(cell);
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
