let selectedCell = null;
let currentPuzzle = [];
let notesMode = false;
let socket = null;
let roomId = null;
let playerId = null;
let isHost = false;
let isSolo = false;
let timerInterval = null;
let elapsedTime = 0;
let isPaused = false;
let playersInRoom = [];
let gameOverModal = null;
let isReconnecting = false;
let currentNotesBoard = Array(9).fill(0).map(() => Array(9).fill(0).map(() => []));
let incorrectCells = Array(9).fill(0).map(() => Array(9).fill(false));

const funnyMessages = [
    "Wow, you're fast! Now, try to look busy.",
    "You've finished! Time to practice your victory dance.",
    "Sudoku master! The others are still counting on their fingers.",
    "You're done! Now you can judge everyone else's moves.",
    "Finished already? Go grab a coffee, you've earned it.",
    "They see you solvin', they hatin'.",
    "You finished so fast, the timer is asking for a recount."
];

const multiplayerCompletionMessages = [
    "You've conquered the puzzle! The leaderboard awaits, so hang tight for the grand reveal!",
    "Sudoku solved! Now, for the moment of truth... the leaderboard is loading!",
    "Mission accomplished! Your score is in, and the final rankings are just around the corner.",
    "Puzzle master! Take a breath, the ultimate showdown on the leaderboard is next.",
    "Done and dusted! Get ready to see where you stand among the best."
];

const eliminationMessages = [
    "Oh no, you've been eliminated! But don't despair, the leaderboard is still coming. Stick around to see the final scores.",
    "Better luck next time! Your journey ends here, but the game continues. The leaderboard will reveal all!",
    "Fouled out! It happens to the best of us. Stay tuned for the final results on the leaderboard.",
    "Game over for you! But the competition rages on. The leaderboard will be worth the wait!",
    "Eliminated! Take a moment, then prepare for the leaderboard reveal. Your efforts won't be forgotten!"
];

const soloEliminationMessages = [
    "Oh no, you've been eliminated!",
    "Better luck next time!",
    "Fouled out! It happens to the best of us.",
    "Game over for you!",
    "Eliminated! Your efforts won't be forgotten!"
];

document.addEventListener('DOMContentLoaded', () => {
    const roomManagementDiv = document.getElementById('room-management');
    const waitingRoomDiv = document.getElementById('waiting-room');
    const playerNameInput = document.getElementById('player-name-input');
    const difficultySelect = document.getElementById('difficulty-select');
    const createRoomBtn = document.getElementById('create-room-btn');
    const roomIdInput = document.getElementById('room-id-input');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const playSoloBtn = document.getElementById('play-solo-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const messageDisplay = document.getElementById('message-display');
    const gameContainer = document.getElementById('game-container');
    const board = document.getElementById('sudoku-board');
    const mistakesCounter = document.getElementById('mistakes-counter');
    const mistakesCounterMobile = document.getElementById('mistakes-counter-mobile');
    const hintButton = document.getElementById('hint-button');
    const hintCountSpan = document.getElementById('hint-count');
    const timerDisplay = document.getElementById('timer');
    const timerDisplayMobile = document.getElementById('timer-mobile');
    const pauseButton = document.getElementById('pause-button');
    const undoButton = document.getElementById('undo-button');
    const notesModeBtn = document.getElementById('notes-button');
    const eraserBtn = document.getElementById('eraser-button');
    const roomIdDisplay = document.getElementById('room-id-display');
    const difficultyDisplay = document.getElementById('difficulty-display');
    const playerListUl = document.getElementById('player-list');
    const waitingPlayerListUl = document.getElementById('waiting-player-list');
    const pauseOverlay = document.getElementById('pause-overlay');
    const finishedOverlay = document.getElementById('finished-overlay');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
    const playAgainSoloBtn = document.getElementById('play-again-solo-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const roomCodeDisplay = document.querySelector('.room-code-display');
    const scoreDisplay = document.getElementById('score');
    const scoreDisplayMobile = document.getElementById('score-mobile');
    const mobilePauseButton = document.getElementById('mobile-pause-button');

    const backToLobbyBtnSolo = document.getElementById('back-to-lobby-btn-solo');
    const finishedTitle = document.querySelector('#finished-overlay .finished-title');
    const completionButtons = document.querySelector('#finished-overlay .completion-buttons');
    const messageIcon = document.querySelector('#finished-overlay .message-icon');

    gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    function hideTooltips() {
        tooltips.forEach(tooltip => tooltip.hide());
    }

    // Add event listeners to tab buttons to hide tooltips
    document.querySelectorAll('#room-tab button').forEach(tabButton => {
        tabButton.addEventListener('shown.bs.tab', hideTooltips);
    });

    // --- Mobile Control Duplication ---
    const numberPalette = document.getElementById('number-palette');
    const mobileNumberPalette = document.getElementById('mobile-number-palette');
    const actionsContainer = document.getElementById('actions-container');
    const mobileActionsContainer = document.getElementById('mobile-actions-container');

    // Clone number buttons
    const numberButtons = numberPalette.querySelectorAll('.number-button');
    numberButtons.forEach(button => {
        const clone = button.cloneNode(true);
        mobileNumberPalette.appendChild(clone);
    });

    // Clone action buttons
    const actionButtons = actionsContainer.querySelectorAll('button');
    actionButtons.forEach(button => {
        const clone = button.cloneNode(true);
        // Remove tooltips from mobile buttons as they are not user-friendly on touch devices
        clone.removeAttribute('data-bs-toggle');
        clone.removeAttribute('data-bs-placement');
        clone.removeAttribute('title');
        
        if (button.id === 'hint-button') {
            const mobileHintCount = document.createElement('span');
            mobileHintCount.className = 'mobile-hint-count';
            clone.appendChild(mobileHintCount);
        }

        mobileActionsContainer.appendChild(clone);
    });

    // --- End Mobile Control Duplication ---

    createRoomBtn.addEventListener('click', handleCreateRoom);
    joinRoomBtn.addEventListener('click', handleJoinRoom);
    playSoloBtn.addEventListener('click', handlePlaySolo);
    startGameBtn.addEventListener('click', () => socket.emit('start_game', { room_id: roomId, player_id: playerId }));
    
    // Add event listeners to both desktop and mobile controls
    document.querySelectorAll('#hint-button').forEach(btn => btn.addEventListener('click', () => socket.emit('hint', { room_id: roomId, player_id: playerId })));
    document.querySelectorAll('#undo-button').forEach(btn => btn.addEventListener('click', () => socket.emit('undo', { room_id: roomId, player_id: playerId })));
    document.querySelectorAll('#notes-button').forEach(btn => btn.addEventListener('click', toggleNotesMode));
    document.querySelectorAll('#eraser-button').forEach(btn => btn.addEventListener('click', handleErase));
    document.querySelectorAll('.number-button').forEach(button => button.addEventListener('click', handleNumberInput));

    pauseButton.addEventListener('click', togglePause);
    mobilePauseButton.addEventListener('click', togglePause);

    backToLobbyBtn.addEventListener('click', () => {
        gameOverModal.hide();
        transitionToRoomView();
    });

    playAgainSoloBtn.addEventListener('click', handlePlayAgainSolo);

    backToLobbyBtnSolo.addEventListener('click', () => {
        hideFinishedOverlay();
        transitionToRoomView();
    });

    document.addEventListener('keydown', handleKeyDown);

    async function handleCreateRoom() {
        const playerName = playerNameInput.value.trim();
        const difficulty = difficultySelect.value;
        if (!playerName) return alert('Please enter your name.');
        
        setLoading(true);
        createRoomBtn.disabled = true;
        try {
            const response = await fetch('https://sudoku-multi-backend.onrender.com/create_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: playerName, difficulty: difficulty, game_mode: 'multiplayer' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');
            
            isHost = true;
            isSolo = false;
            console.log('handleCreateRoom: Calling initializeGame (multiplayer)');
            initializeGame(data.room_id, data.player_id, data.puzzle, data.difficulty);
        } catch (error) {
            console.error('Error creating room:', error);
            alert(`Failed to create room: ${error.message}`);
        } finally {
            setLoading(false);
            createRoomBtn.disabled = false;
        }
    }

    async function handleJoinRoom() {
        const playerName = playerNameInput.value.trim();
        const inputRoomId = roomIdInput.value.trim();
        if (!playerName || !inputRoomId) return alert('Please enter your name and Room ID.');

        setLoading(true);
        joinRoomBtn.disabled = true;
        try {
            const response = await fetch('https://sudoku-multi-backend.onrender.com/join_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: inputRoomId, player_name: playerName }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');

            isHost = false;
            isSolo = false;
            console.log('handleJoinRoom: Calling initializeGame (multiplayer)');
            initializeGame(data.room_id, data.player_id, data.puzzle, data.difficulty);
        } catch (error) {
            console.error('Error joining room:', error);
            alert(`Failed to join room: ${error.message}`);
        } finally {
            setLoading(false);
            joinRoomBtn.disabled = false;
        }
    }

    async function handlePlaySolo() {
        hideFinishedOverlay(); // Hide the finished overlay when starting a new solo game
        const difficulty = difficultySelect.value;
        const playerName = "Solo Player";
        
        setLoading(true);
        playSoloBtn.disabled = true;
        try {
            const response = await fetch('https://sudoku-multi-backend.onrender.com/create_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: playerName, difficulty: difficulty, game_mode: 'solo' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');
            
            isHost = true;
            isSolo = true;
            console.log('handlePlaySolo: Calling initializeGame (solo)');
            initializeGame(data.room_id, data.player_id, data.puzzle, difficulty);
        } catch (error) {
            console.error('Error creating room:', error);
            alert(`Failed to create room: ${error.message}`);
            playSoloBtn.disabled = false; // Re-enable only on error
        }
    }

    async function handlePlayAgainSolo() {
        isReconnecting = true;
        const difficulty = difficultyDisplay.textContent.toLowerCase();

        if (!difficulty || difficulty === 'n/a') {
            console.error("Could not determine difficulty to start new game.");
            alert("Could not start a new game. Please return to the lobby.");
            return;
        }

        // Reset state and show loading overlay
        resetGameState();
        setLoading(true);

        try {
            const response = await fetch('https://sudoku-multi-backend.onrender.com/create_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: "Solo Player", difficulty: difficulty, game_mode: 'solo' }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');

            isHost = true;
            isSolo = true;
            // This will render the new board and connect the socket.
            // The 'game_started' event will then call transitionToGameView and setLoading(false)
            initializeGame(data.room_id, data.player_id, data.puzzle, difficulty);
        } catch (error) {
            console.error('Error creating room for play again:', error);
            alert(`Failed to start new game: ${error.message}`);
            setLoading(false); // Only turn off loading on error
        }
    }

    function initializeGame(newRoomId, newPlayerId, puzzle, difficulty) {
        roomId = newRoomId;
        playerId = newPlayerId;
        currentPuzzle = puzzle;
        
        renderBoard(puzzle, currentPuzzle, currentNotesBoard);
        updateGameInfo(roomId, difficulty, isSolo);
        connectWebSocket();

        if (isSolo) {
            console.log('initializeGame: isSolo is true, waiting for game_started event.');
        } else {
            console.log('initializeGame: isSolo is false, calling transitionToWaitingRoom()');
            transitionToWaitingRoom();
        }
    }

    function connectWebSocket() {
        if (socket) {
            socket.disconnect();
        }
        socket = io("https://sudoku-multi-backend.onrender.com");

        socket.on('connect', () => {
            console.log('Socket.IO connected!');
            socket.emit('join', { room_id: roomId, player_id: playerId });
            
            if (isSolo) {
                console.log('connect: isSolo is true, emitting start_game');
                socket.emit('start_game', { room_id: roomId, player_id: playerId });
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected!');
            if (!isReconnecting && !isSolo) {
                showLeaderboard([], 'Disconnected from the room.');
            }
            isReconnecting = false; // Reset the flag
        });

        socket.on('game_started', (data) => {
            console.log('game_started event received! isSolo:', isSolo);
            transitionToGameView(isSolo);
            startTimer(data.start_time);
            if (isSolo) {
                setLoading(false);
            }
        });

        socket.on('game_state_update', (data) => {
            currentPuzzle = data.game_state.current_board;
            currentNotesBoard = data.game_state.notes_board;
            
            if (data.last_move) {
                const { row, col, value, is_correct } = data.last_move;
                if (value === 0) {
                    incorrectCells[row][col] = false;
                } else if (!is_correct) {
                    incorrectCells[row][col] = true;
                } else {
                    incorrectCells[row][col] = false;
                }
            }

            renderBoard(data.game_state.puzzle, currentPuzzle, currentNotesBoard);
            updateStats(data.mistakes, data.hints_used, data.score);

            if (data.last_move) {
                const { row, col, value, is_correct } = data.last_move;
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                if (cell) {
                    if (is_correct) {
                        cell.classList.add('correct-flash');
                        setTimeout(() => cell.classList.remove('correct-flash'), 500);
                    } else {
                        cell.classList.add('wrong');
                    }
                }
                if (value !== 0) {
                    highlightActiveNumbers(value);
                } else {
                    clearHighlights();
                }
            }
        });

        socket.on('hint_given', (data) => {
            const { row, col, value, hints_used, score } = data;
            const hintedCell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (hintedCell) {
                hintedCell.textContent = value;
                hintedCell.classList.add('fixed', 'hint-flash');
                flashRelatedCells(row, col, value);
                setTimeout(() => hintedCell.classList.remove('hint-flash'), 1000);
            }
            updateStats(null, hints_used, score);
        });

        socket.on('player_eliminated', (data) => {
            showTemporaryMessage(`${data.player_name} has been eliminated!`)
        });

        socket.on('eliminated', (data) => {
            showEliminationOverlay(data.message);
        });

        socket.on('player_finished', (data) => {
            if (!isSolo) { // Only show message for multiplayer
                showTemporaryMessage(`${data.player_name} has finished the puzzle!`)
            }
            if (data.player_id === playerId) {
                stopTimer();
                disableInput();
                showFinishedOverlay();
            }
        });

        socket.on('game_over', (data) => {
            stopTimer();
            disableInput();
            if (isSolo) {
                // For solo mode, the finishedOverlay is already shown by player_finished,
                // and it serves as the game over screen. The message is already set.
                // No need to hide it here.
            } else {
                hideFinishedOverlay(); // Only hide for multiplayer, as leaderboard modal will show.
                showLeaderboard(data.leaderboard, data.message);
            }
        });

        socket.on('current_players', (data) => {
            playersInRoom = data.players;
            updatePlayerList();
            updateWaitingPlayerList();
            if (isHost && !isSolo) {
                startGameBtn.disabled = playersInRoom.length < 2;
            }
        });

        socket.on('player_left', (data) => {
            showTemporaryMessage(`${data.player_name} left the room.`);
        });

        socket.on('error', (data) => {
            alert(`Error: ${data.message}`);
        });
    }

    function handleNumberInput(e) {
        if (isPaused || !selectedCell || selectedCell.classList.contains('fixed')) return;
        
        const value = parseInt(e.currentTarget.dataset.number);
        const r = parseInt(selectedCell.dataset.row);
        const c = parseInt(selectedCell.dataset.col);

        if (notesMode) {
            toggleNote(selectedCell, value);
            socket.emit('notes', { room_id: roomId, player_id: playerId, row: r, col: c, notes: JSON.parse(selectedCell.dataset.notes || '[]') });
        } else {
            socket.emit('move', { room_id: roomId, player_id: playerId, row: r, col: c, value: value });
        }
    }

    function handleKeyDown(e) {
        if (isPaused || !selectedCell || selectedCell.classList.contains('fixed')) return;

        const r = parseInt(selectedCell.dataset.row);
        const c = parseInt(selectedCell.dataset.col);

        if (e.key >= '1' && e.key <= '9') {
            const value = parseInt(e.key);
            if (notesMode) {
            toggleNote(selectedCell, value);
            socket.emit('notes', { room_id: roomId, player_id: playerId, row: r, col: c, notes: JSON.parse(selectedCell.dataset.notes || '[]') });
        } else {
            socket.emit('move', { room_id: roomId, player_id: playerId, row: r, col: c, value: value });
        }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            if (notesMode) {
                socket.emit('notes', { room_id: roomId, player_id: playerId, row: r, col: c, notes: [] });
            } else {
                socket.emit('move', { room_id: roomId, player_id: playerId, row: r, col: c, value: 0 });
            }
        }
    }

    const renderBoard = (puzzle, currentBoard, notesBoard) => {
        board.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (incorrectCells[r][c]) {
                    cell.classList.add('incorrect');
                }

                const initialValue = puzzle[r][c];
                const currentValue = currentBoard[r][c];
                const cellNotes = notesBoard[r][c];

                if (initialValue !== 0) {
                    cell.textContent = initialValue;
                    cell.classList.add('fixed');
                } else if (currentValue !== 0) {
                    cell.textContent = currentValue;
                } else if (cellNotes && cellNotes.length > 0) {
                    cell.classList.add('has-notes');
                    renderNotes(cell, cellNotes);
                }

                cell.addEventListener('click', () => selectCell(cell));
                board.appendChild(cell);
            }
        }
        updateNumberPalette();
    };

    const selectCell = (cell) => {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        clearHighlights();
        selectedCell = cell;
        selectedCell.classList.add('selected');
        highlightRelatedCells(selectedCell.dataset.row, selectedCell.dataset.col);
        
        if (selectedCell.textContent && !selectedCell.classList.contains('has-notes')) {
            highlightActiveNumbers(parseInt(selectedCell.textContent));
        }
        const r = parseInt(selectedCell.dataset.row);
        const c = parseInt(selectedCell.dataset.col);
        selectedCell.dataset.notes = JSON.stringify(currentNotesBoard[r][c] || []);
    };

    const highlightRelatedCells = (row, col) => {
        document.querySelectorAll('.cell').forEach(cell => {
            const r = cell.dataset.row;
            const c = cell.dataset.col;
            const boxRowStart = Math.floor(row / 3) * 3;
            const boxColStart = Math.floor(col / 3) * 3;

            if (r == row || c == col || (r >= boxRowStart && r < boxRowStart + 3 && c >= boxColStart && c < boxColStart + 3)) {
                cell.classList.add('highlight');
            }
        });
    };

    const flashRelatedCells = (row, col, value) => {
        document.querySelectorAll('.cell').forEach(cell => {
            const r = cell.dataset.row;
            const c = cell.dataset.col;
            const boxRowStart = Math.floor(row / 3) * 3;
            const boxColStart = Math.floor(col / 3) * 3;

            const inRow = r == row;
            const inCol = c == col;
            const inBox = (r >= boxRowStart && r < boxRowStart + 3 && c >= boxColStart && c < boxColStart + 3);

            if (inRow || inCol || inBox) {
                if (cell.textContent == value) {
                    cell.classList.add('hint-conflict');
                    setTimeout(() => cell.classList.remove('hint-conflict'), 1000);
                } else if (cell.dataset.row != row || cell.dataset.col != col) {
                    cell.classList.add('hint-flash-related');
                    setTimeout(() => cell.classList.remove('hint-flash-related'), 1000);
                }
            }
        });
    };

    const highlightActiveNumbers = (number) => {
        document.querySelectorAll('.cell').forEach(cell => {
            if (parseInt(cell.textContent) === number && !cell.classList.contains('has-notes')) {
                cell.classList.add('highlight-active');
            }
        });
    };

    const clearHighlights = () => {
        document.querySelectorAll('.cell.highlight, .cell.highlight-active, .cell.wrong, .cell.selected').forEach(cell => {
            cell.classList.remove('highlight', 'highlight-active', 'wrong', 'selected');
        });
    };

    function toggleNotesMode() {
        notesMode = !notesMode;
        document.querySelectorAll('#notes-button').forEach(btn => {
            btn.classList.toggle('active', notesMode);
        });
    }

    function handleErase() {
        if (isPaused || !selectedCell || selectedCell.classList.contains('fixed')) return;

        const r = parseInt(selectedCell.dataset.row);
        const c = parseInt(selectedCell.dataset.col);

        if (currentNotesBoard[r][c] && currentNotesBoard[r][c].length > 0) {
            socket.emit('notes', { room_id: roomId, player_id: playerId, row: r, col: c, notes: [] });
        } else if (currentPuzzle[r][c] !== 0) {
            socket.emit('move', { room_id: roomId, player_id: playerId, row: r, col: c, value: 0 });
        }
    }

    const toggleNote = (cell, number) => {
        cell.classList.add('has-notes');
        cell.textContent = '';
        let notes = cell.dataset.notes ? JSON.parse(cell.dataset.notes) : [];

        if (number === 0) {
            notes = [];
        } else if (notes.includes(number)) {
            notes = notes.filter(n => n !== number);
        } else {
            notes.push(number);
        }
        cell.dataset.notes = JSON.stringify(notes);
        renderNotes(cell, notes);
    };

    const renderNotes = (cell, notes) => {
        cell.innerHTML = '';
        if (notes.length > 0) {
            const notesDiv = document.createElement('div');
            notesDiv.classList.add('notes');
            notes.sort().forEach(note => {
                const noteSpan = document.createElement('span');
                noteSpan.textContent = note;
                notesDiv.appendChild(noteSpan);
            });
            cell.appendChild(notesDiv);
            cell.classList.add('has-notes');
        } else {
            cell.classList.remove('has-notes');
            cell.dataset.notes = '[]';
        }
    };

    const updateNumberPalette = () => {
        const counts = Array(10).fill(0);
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentPuzzle[r][c] !== 0) {
                    counts[currentPuzzle[r][c]]++;
                }
            }
        }
        document.querySelectorAll('.number-button').forEach(button => {
            const number = parseInt(button.dataset.number);
            if (number > 0) {
                const isUsed = counts[number] === 9;
                button.classList.toggle('used', isUsed);
                // Ensure mobile buttons are also updated
                const mobileButton = document.querySelector(`#mobile-number-palette .number-button[data-number="${number}"]`);
                if (mobileButton) {
                    mobileButton.classList.toggle('used', isUsed);
                }
            }
        });
    };

    function updatePlayerList() {
        const playerLists = [document.getElementById('player-list'), document.getElementById('mobile-player-list')];
        
        playerLists.forEach(playerListUl => {
            if (!playerListUl) return;

            const newPlayersMap = new Map(playersInRoom.map(p => [p.player_id, p]));
            const existingPlayerIds = new Set(Array.from(playerListUl.children).map(el => el.dataset.playerId));

            existingPlayerIds.forEach(playerId => {
                if (!newPlayersMap.has(playerId)) {
                    const el = playerListUl.querySelector(`[data-player-id="${playerId}"]`);
                    if (el) el.remove();
                }
            });

            playersInRoom.forEach((player, index) => {
                let listItem = playerListUl.querySelector(`[data-player-id="${player.player_id}"]`);
                const isMobile = playerListUl.id === 'mobile-player-list';

                if (!listItem) {
                    listItem = document.createElement('li');
                    listItem.dataset.playerId = player.player_id;
                    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                    const avatar = document.createElement('div');
                    avatar.className = 'player-avatar';
                    avatar.textContent = player.player_name.charAt(0).toUpperCase();

                    const playerInfo = document.createElement('div');
                    playerInfo.className = 'player-info';

                    const playerNameSpan = document.createElement('span');
                    playerNameSpan.className = 'player-name';
                    
                    playerInfo.appendChild(playerNameSpan);

                    if (isMobile) {
                        const playerStatusSpan = document.createElement('span');
                        playerStatusSpan.className = 'player-status';
                        playerInfo.appendChild(playerStatusSpan);
                    }

                    const playerScoreSpan = document.createElement('span');
                    playerScoreSpan.className = 'badge bg-primary rounded-pill player-score';

                    listItem.appendChild(avatar);
                    listItem.appendChild(playerInfo);
                    listItem.appendChild(playerScoreSpan);
                }

                const playerNameEl = listItem.querySelector('.player-name');
                playerNameEl.textContent = player.player_name + (player.player_id === playerId ? ' (You)' : '');

                if (isMobile) {
                    const playerStatusEl = listItem.querySelector('.player-status');
                    if (player.eliminated) {
                        playerStatusEl.textContent = 'Eliminated';
                        playerStatusEl.className = 'player-status eliminated';
                    } else if (player.finished) {
                        playerStatusEl.textContent = 'Finished';
                        playerStatusEl.className = 'player-status finished';
                    } else {
                        playerStatusEl.textContent = 'Playing';
                        playerStatusEl.className = 'player-status playing';
                    }
                } else {
                    if (player.finished) {
                        playerNameEl.innerHTML += ' <span class="text-success">&#10004;</span>'; // Checkmark
                    }
                }

                listItem.querySelector('.player-score').textContent = player.score;
                listItem.classList.toggle('eliminated', player.eliminated);
                listItem.classList.toggle('finished', player.finished);

                if (playerListUl.children[index] !== listItem) {
                    playerListUl.insertBefore(listItem, playerListUl.children[index]);
                }
            });
        });
    }

    function updateWaitingPlayerList() {
        waitingPlayerListUl.innerHTML = '';
        playersInRoom.forEach(player => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = player.player_name + (player.player_id === playerId ? ' (You)' : '');
            waitingPlayerListUl.appendChild(listItem);
        });
    }

    function updateStats(mistakes, hints, score) {
        if (mistakes !== null && mistakes !== undefined) {
            const mistakeText = `${mistakes} / 3`;
            if(mistakesCounter) mistakesCounter.textContent = mistakeText;
            if (mistakesCounterMobile) mistakesCounterMobile.textContent = mistakeText;
        }
        if (hints !== null && hints !== undefined) {
            const hintsLeft = 3 - hints;
            const desktopHintButton = document.querySelector('#actions-container #hint-button');
            const mobileHintButton = document.querySelector('#mobile-actions-container #hint-button');

            if (desktopHintButton) {
                const hintCountSpan = desktopHintButton.querySelector('#hint-count');
                hintCountSpan.textContent = hintsLeft;
                hintCountSpan.style.display = hintsLeft > 0 ? 'block' : 'none';
                desktopHintButton.disabled = hintsLeft <= 0;
            }

            if (mobileHintButton) {
                const mobileHintCountSpan = mobileHintButton.querySelector('.mobile-hint-count');
                if (mobileHintCountSpan) {
                    mobileHintCountSpan.textContent = hintsLeft;
                }
                mobileHintButton.disabled = hintsLeft <= 0;
            }
        }
        if (score !== null && score !== undefined) {
            if(scoreDisplay) scoreDisplay.textContent = score;
            if(scoreDisplayMobile) scoreDisplayMobile.textContent = score;
        }
    }

    function startTimer(serverStartTime) {
        if (timerInterval) clearInterval(timerInterval);

        const startTime = isSolo ? Date.now() / 1000 : serverStartTime;

        const updateDisplay = () => {
            if (!isPaused) {
                const now = Date.now() / 1000;
                elapsedTime = Math.max(0, Math.floor(now - startTime));
                
                const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
                const seconds = (elapsedTime % 60).toString().padStart(2, '0');
                const timeString = `${minutes}:${seconds}`;
                timerDisplay.textContent = timeString;
                if (timerDisplayMobile) timerDisplayMobile.textContent = timeString;
            }
        };

        updateDisplay();
        timerInterval = setInterval(updateDisplay, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function togglePause() {
        isPaused = !isPaused;
        const icon = isPaused ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5"/></svg>`;
        
        if(pauseButton) pauseButton.innerHTML = icon;
        if(mobilePauseButton) mobilePauseButton.innerHTML = icon;

        if(pauseButton) pauseButton.classList.toggle('btn-light', !isPaused);
        if(pauseButton) pauseButton.classList.toggle('btn-success', isPaused);

        if(mobilePauseButton) mobilePauseButton.classList.toggle('btn-light', !isPaused);
        if(mobilePauseButton) mobilePauseButton.classList.toggle('btn-success', isPaused);

        pauseOverlay.classList.toggle('d-none', !isPaused);
    }

    function disableInput() {
        document.querySelectorAll('.number-button, #actions-container button, #mobile-controls button').forEach(button => {
            button.disabled = true;
        });
        document.removeEventListener('keydown', handleKeyDown);
    }

    function enableInput() {
        document.querySelectorAll('.number-button, #actions-container button, #mobile-controls button').forEach(button => {
            button.disabled = false;
        });
        document.addEventListener('keydown', handleKeyDown);
    }

    function transitionToWaitingRoom() {
        roomManagementDiv.style.display = 'none';
        gameContainer.style.display = 'none';
        waitingRoomDiv.style.display = 'block';
        roomCodeDisplay.textContent = roomId;
        updateStats(0, 0, 0);
    }

    function transitionToGameView(isSoloParam) {
        roomManagementDiv.style.display = 'none';
        waitingRoomDiv.style.display = 'none';
        gameContainer.style.display = 'block';
        
        const playersPanel = document.getElementById('players-panel');
        const roomInfoGame = document.getElementById('room-info-game');
        const mobilePlayerListAccordion = document.getElementById('mobile-player-list-accordion');

        if (isSoloParam) {
            if(playersPanel) playersPanel.style.display = 'none';
            if(roomInfoGame) roomInfoGame.style.display = 'none';
            if(mobilePlayerListAccordion) mobilePlayerListAccordion.style.display = 'none';
        } else {
            if(playersPanel) playersPanel.style.display = 'block';
            if(roomInfoGame) roomInfoGame.style.display = 'flex';
            if(mobilePlayerListAccordion) mobilePlayerListAccordion.style.display = 'block';
        }

        updateStats(0, 0, 0);
        enableInput();
    }

    function transitionToRoomView() {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        gameContainer.style.display = 'none';
        waitingRoomDiv.style.display = 'none';
        roomManagementDiv.style.display = 'block';
        stopTimer();
        resetGameState();
        playSoloBtn.disabled = false;
    }

    function resetGameState() {
        elapsedTime = 0;
        currentPuzzle = [];
        notesMode = false;
        isPaused = false;
        if (pauseOverlay.classList.contains('d-none') === false) togglePause();
        playersInRoom = [];
        selectedCell = null;
        incorrectCells = Array(9).fill(0).map(() => Array(9).fill(false));
        updatePlayerList();
        updateWaitingPlayerList();
        updateStats(0, 0, 0);
        timerDisplay.textContent = '00:00';
        if (timerDisplayMobile) timerDisplayMobile.textContent = '00:00';
        board.innerHTML = '';
        hideFinishedOverlay();
    }
    
    function updateGameInfo(roomId, difficulty, isSoloParam) {
        const mobileDifficultyDisplay = document.getElementById('mobile-difficulty-display');
        if (isSoloParam) {
            roomIdDisplay.parentElement.style.display = 'none';
        }
        else {
            roomIdDisplay.parentElement.style.display = 'flex';
            roomIdDisplay.textContent = roomId;
        }
        difficultyDisplay.textContent = difficulty;
        if(mobileDifficultyDisplay) mobileDifficultyDisplay.textContent = difficulty;
    }

    function setLoading(isLoading) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }

    function showTemporaryMessage(text) {
        messageDisplay.textContent = text;
        messageDisplay.style.display = 'block';
        setTimeout(() => {
            messageDisplay.style.display = 'none';
        }, 4000);
    }

    function showFinishedOverlay() {
        finishedTitle.textContent = 'Puzzle Solved!';
        completionButtons.style.display = 'flex'; // Ensure buttons are visible for completion
        messageIcon.classList.remove('eliminated');
        messageIcon.classList.add('success');
        if (isSolo) {
            const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            gameOverMessage.textContent = message;
            messageIcon.innerHTML = '&#10003;'; // Checkmark icon
        } else {
            const message = multiplayerCompletionMessages[Math.floor(Math.random() * multiplayerCompletionMessages.length)];
            gameOverMessage.textContent = message;
            messageIcon.innerHTML = '&#127942;'; // Trophy icon
        }
        finishedOverlay.classList.add('show');
    }

    function showEliminationOverlay(message) {
        stopTimer();
        disableInput();
        finishedTitle.textContent = 'Game Over!';
        messageIcon.classList.remove('success');
        messageIcon.classList.add('eliminated');
        messageIcon.innerHTML = '&#10060;'; // Cross mark icon
        const messageArray = isSolo ? soloEliminationMessages : eliminationMessages;
        const randomEliminationMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
        gameOverMessage.textContent = randomEliminationMessage;
        completionButtons.style.display = 'none'; // Hide buttons for elimination
        finishedOverlay.classList.add('show');
    }

    function hideFinishedOverlay() {
        if (finishedOverlay) {
            finishedOverlay.classList.remove('show'); // Use remove('show') instead of add('d-none')
        }
    }

    function showLeaderboard(leaderboard, message) {
        document.getElementById('gameOverModalMessage').textContent = message;
        document.getElementById('leaderboard-podium').style.display = 'flex';
        document.getElementById('leaderboard-rest').style.display = 'block';

        const podiumContainer = document.getElementById('leaderboard-podium');
        const listContainer = document.getElementById('leaderboard-list');
        podiumContainer.innerHTML = '';
        listContainer.innerHTML = '';

        const topThree = leaderboard.slice(0, 3);
        const rest = leaderboard.slice(3);

        topThree.forEach((player, index) => {
            const place = index + 1;
            const podiumEl = document.createElement('div');
            podiumEl.className = `podium-place podium-${place}`;
            podiumEl.innerHTML = `
                <div class="podium-rank">${place}</div>
                <div class="podium-name">${player.player_name}</div>
                <div class="podium-score">Score: ${player.score}</div>
            `;
            podiumContainer.appendChild(podiumEl);
        });

        rest.forEach((player, index) => {
            const rank = index + 4;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                <span><strong>#${rank}</strong> ${player.player_name}</span>
                <span class="badge bg-secondary">${player.score}</span>
            `;
            listContainer.appendChild(listItem);
        });

        gameOverModal.show();
    }

    // Removed showSoloCompletionMessage as it's no longer needed.
    // The logic for solo completion message is now handled directly in socket.on('game_over')

    disableInput();
});
