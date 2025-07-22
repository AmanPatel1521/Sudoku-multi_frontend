let selectedCell = null;
let currentPuzzle = [];
let notesMode = false;
let socket = null;
let roomId = null;
let playerId = null;
let isHost = false;
let timerInterval = null;
let elapsedTime = 0;
let isPaused = false;
let playersInRoom = {};
let gameOverModal = null;

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selectors ---
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
    const timerDisplay = document.getElementById('timer');
    const timerDisplayMobile = document.getElementById('timer-mobile');
    const pauseButton = document.getElementById('pause-button');
    const undoButton = document.getElementById('undo-button');
    const notesModeBtn = document.getElementById('notes-button');
    const roomIdDisplay = document.getElementById('room-id-display');
    const difficultyDisplay = document.getElementById('difficulty-display');
    const playerListUl = document.getElementById('player-list');
    const waitingPlayerListUl = document.getElementById('waiting-player-list');
    const pauseOverlay = document.getElementById('pause-overlay');
    const playAgainBtn = document.getElementById('play-again-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const roomCodeDisplay = document.querySelector('.room-code-display');
    const scoreDisplay = document.getElementById('score');

    gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // --- Event Listeners ---
    createRoomBtn.addEventListener('click', handleCreateRoom);
    joinRoomBtn.addEventListener('click', handleJoinRoom);
    playSoloBtn.addEventListener('click', handlePlaySolo);
    startGameBtn.addEventListener('click', () => socket.emit('start_game', { room_id: roomId, player_id: playerId }));
    hintButton.addEventListener('click', () => socket.emit('hint', { room_id: roomId, player_id: playerId }));
    undoButton.addEventListener('click', () => socket.emit('undo', { room_id: roomId, player_id: playerId }));
    pauseButton.addEventListener('click', togglePause);
    notesModeBtn.addEventListener('click', toggleNotesMode);
    playAgainBtn.addEventListener('click', () => {
        gameOverModal.hide();
        transitionToRoomView();
    });

    document.querySelectorAll('.number-button').forEach(button => {
        button.addEventListener('click', handleNumberInput);
    });
    document.addEventListener('keydown', handleKeyDown);

    // --- Core Functions ---
    async function handleCreateRoom() {
        const playerName = playerNameInput.value.trim();
        const difficulty = difficultySelect.value;
        if (!playerName) return alert('Please enter your name.');
        
        setLoading(true);
        createRoomBtn.disabled = true;
        try {
            const response = await fetch('http://127.0.0.1:5000/create_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: playerName, difficulty: difficulty }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');
            
            isHost = true;
            initializeGame(data.room_id, data.player_id, data.puzzle, difficulty, false);
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
            const response = await fetch('http://127.0.0.1:5000/join_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: inputRoomId, player_name: playerName }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');

            isHost = false;
            initializeGame(data.room_id, data.player_id, data.puzzle, 'N/A', false);
        } catch (error) {
            console.error('Error joining room:', error);
            alert(`Failed to join room: ${error.message}`);
        } finally {
            setLoading(false);
            joinRoomBtn.disabled = false;
        }
    }

    async function handlePlaySolo() {
        const difficulty = difficultySelect.value;
        const playerName = "Solo Player";
        
        setLoading(true);
        playSoloBtn.disabled = true;
        try {
            const response = await fetch('http://127.0.0.1:5000/create_room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: playerName, difficulty: difficulty }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unknown error');
            
            isHost = true;
            initializeGame(data.room_id, data.player_id, data.puzzle, difficulty, true);
        } catch (error) {
            console.error('Error creating room:', error);
            alert(`Failed to create room: ${error.message}`);
        } finally {
            setLoading(false);
            playSoloBtn.disabled = false;
        }
    }

    function initializeGame(newRoomId, newPlayerId, puzzle, difficulty, gameStarted) {
        roomId = newRoomId;
        playerId = newPlayerId;
        currentPuzzle = puzzle;
        
        if (gameStarted) {
            transitionToGameView(true);
        } else {
            transitionToWaitingRoom();
        }

        renderBoard(puzzle, currentPuzzle);
        updateGameInfo(roomId, difficulty);
        connectWebSocket();
    }

    function connectWebSocket() {
        socket = io("http://127.0.0.1:5000");

        socket.on('connect', () => {
            console.log('Socket.IO connected!');
            socket.emit('join', { room_id: roomId, player_id: playerId });
        });

        socket.on('disconnect', () => {
            showGameOver('Disconnected from the room.');
        });

        socket.on('game_started', () => {
            transitionToGameView();
        });

        socket.on('game_state_update', (data) => {
            currentPuzzle = data.game_state.current_board;
            renderBoard(data.game_state.puzzle, currentPuzzle);
            updateStats(data.mistakes, data.hints_used, data.score);
            if (data.last_move) {
                const { row, col, is_correct } = data.last_move;
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                if (cell) {
                    if (is_correct) {
                        cell.classList.add('correct-flash');
                        setTimeout(() => cell.classList.remove('correct-flash'), 500);
                    } else {
                        cell.classList.add('wrong');
                    }
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

        socket.on('eliminated', (data) => {
            showGameOver(data.message);
            disableInput();
            stopTimer();
        });

        socket.on('game_over', (data) => {
            showGameOver(data.message);
            disableInput();
            stopTimer();
        });

        socket.on('current_players', (data) => {
            playersInRoom = {};
            data.players.forEach(p => {
                playersInRoom[p.player_id] = { name: p.player_name, eliminated: p.eliminated };
            });
            updatePlayerList();
            updateWaitingPlayerList();
            if (isHost) {
                startGameBtn.disabled = Object.keys(playersInRoom).length < 2;
            }
        });

        socket.on('player_left', (data) => {
            delete playersInRoom[data.player_id];
            updatePlayerList();
            updateWaitingPlayerList();
            showTemporaryMessage(`${data.player_name} left the room.`);
            if (isHost) {
                startGameBtn.disabled = Object.keys(playersInRoom).length < 2;
            }
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

        if (notesMode && value !== 0) {
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
            socket.emit('move', { room_id: roomId, player_id: playerId, row: r, col: c, value: 0 });
        }
    }

    // --- UI Rendering and Updates ---
    const renderBoard = (puzzle, currentBoard) => {
        board.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                const initialValue = puzzle[r][c];
                const currentValue = currentBoard[r][c];

                if (initialValue !== 0) {
                    cell.textContent = initialValue;
                    cell.classList.add('fixed');
                } else if (currentValue !== 0) {
                    cell.textContent = currentValue;
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
        notesModeBtn.classList.toggle('active', notesMode);
    }

    const toggleNote = (cell, number) => {
        cell.classList.add('has-notes');
        cell.textContent = '';
        let notes = cell.dataset.notes ? JSON.parse(cell.dataset.notes) : [];
        if (notes.includes(number)) {
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
                button.classList.toggle('used', counts[number] === 9);
            }
        });
    };

    function updatePlayerList() {
        playerListUl.innerHTML = '';
        for (const pId in playersInRoom) {
            const player = playersInRoom[pId];
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = player.name + (pId === playerId ? ' (You)' : '');
            if (player.eliminated) {
                listItem.classList.add('eliminated');
            }
            playerListUl.appendChild(listItem);
        }
    }

    function updateWaitingPlayerList() {
        waitingPlayerListUl.innerHTML = '';
        for (const pId in playersInRoom) {
            const player = playersInRoom[pId];
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = player.name + (pId === playerId ? ' (You)' : '');
            waitingPlayerListUl.appendChild(listItem);
        }
    }

    function updateStats(mistakes, hints, score) {
        if (mistakes !== null && mistakes !== undefined) {
            const mistakeText = `${mistakes} / 3`;
            if(mistakesCounter) mistakesCounter.textContent = mistakeText;
            if (mistakesCounterMobile) mistakesCounterMobile.textContent = mistakeText;
        }
        if (hints !== null && hints !== undefined) {
            const hintsLeft = 3 - hints;
            const hintButtonSpan = hintButton.querySelector('span');
            if(hintButtonSpan) hintButtonSpan.textContent = `Hint (${hintsLeft} left)`;
            hintButton.disabled = hintsLeft <= 0;
        }
        if (score !== null && score !== undefined) {
            if(scoreDisplay) scoreDisplay.textContent = score;
        }
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            if (!isPaused) {
                elapsedTime++;
                const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
                const seconds = (elapsedTime % 60).toString().padStart(2, '0');
                const timeString = `${minutes}:${seconds}`;
                timerDisplay.textContent = timeString;
                if (timerDisplayMobile) timerDisplayMobile.textContent = timeString;
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function togglePause() {
        isPaused = !isPaused;
        pauseButton.innerHTML = isPaused ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5"/></svg>`;
        pauseButton.classList.toggle('btn-light', !isPaused);
        pauseButton.classList.toggle('btn-success', isPaused);
        pauseOverlay.classList.toggle('d-none', !isPaused);
    }

    // --- UI Control and Transitions ---
    function disableInput() {
        document.querySelectorAll('.number-button, #actions-container button').forEach(button => {
            button.disabled = true;
        });
        document.removeEventListener('keydown', handleKeyDown);
    }

    function enableInput() {
        document.querySelectorAll('.number-button, #actions-container button').forEach(button => {
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

    function transitionToGameView(isSolo = false) {
        roomManagementDiv.style.display = 'none';
        waitingRoomDiv.style.display = 'none';
        gameContainer.style.display = 'block';
        if (isSolo) {
            const gameInfoPanel = document.getElementById('game-info-panel');
            const playersPanel = document.getElementById('players-panel');
            if(gameInfoPanel) gameInfoPanel.style.display = 'none';
            if(playersPanel) playersPanel.style.display = 'none';
        }
        updateStats(0, 0, 0);
        enableInput();
        startTimer();
    }

    function transitionToRoomView() {
        gameContainer.style.display = 'none';
        waitingRoomDiv.style.display = 'none';
        roomManagementDiv.style.display = 'block';
        stopTimer();
        resetGameState();
    }

    function resetGameState() {
        elapsedTime = 0;
        currentPuzzle = [];
        notesMode = false;
        isPaused = false;
        if (pauseOverlay.classList.contains('d-none') === false) togglePause();
        playersInRoom = {};
        selectedCell = null;
        updatePlayerList();
        updateWaitingPlayerList();
        updateStats(0, 0, 0);
        timerDisplay.textContent = '00:00';
        if (timerDisplayMobile) timerDisplayMobile.textContent = '00:00';
        board.innerHTML = '';
    }
    
    function updateGameInfo(roomId, difficulty) {
        roomIdDisplay.textContent = roomId;
        difficultyDisplay.textContent = difficulty;
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

    function showGameOver(message) {
        document.getElementById('gameOverMessage').textContent = message;
        gameOverModal.show();
    }

    // --- Initial State ---
    disableInput();
});