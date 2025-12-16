const SIZE = 15;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

// 🔗 BACKEND API (chỉ chừa sẵn, CHƯA sử dụng)
// Ví dụ:
// const API_URL = 'http://localhost:3000';

let board = [];
let aiEnabled = true; // 🤖 bật chế độ AI đánh với người
let humanPlayer = 'X';
let aiPlayer = 'O';
let gameOver = false;

function initBoard() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  boardElement.innerHTML = '';
  gameOver = false;
  statusElement.textContent = `Lượt: ${humanPlayer}`;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleClick);
      boardElement.appendChild(cell);
    }
  }
}

function handleClick(e) {
  if (gameOver) return;

  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;

  if (board[row][col] !== '') return;

  // ===== Người chơi =====
  board[row][col] = humanPlayer;
  e.target.textContent = humanPlayer;

  if (checkWin(row, col, humanPlayer)) {
    statusElement.textContent = `Bạn thắng!`;
    gameOver = true;
    return;
  }

  if (aiEnabled) {
    statusElement.textContent = 'AI đang suy nghĩ...';
    requestAIMove();
    return;
  }

  statusElement.textContent = `Lượt: ${aiEnabled ? aiPlayer : humanPlayer}`;
}

function checkWin(row, col, player) {
  return (
    count(row, col, 1, 0, player) + count(row, col, -1, 0, player) >= 4 ||
    count(row, col, 0, 1, player) + count(row, col, 0, -1, player) >= 4 ||
    count(row, col, 1, 1, player) + count(row, col, -1, -1, player) >= 4 ||
    count(row, col, 1, -1, player) + count(row, col, -1, 1, player) >= 4
  );
}

function count(row, col, dr, dc, player) {
  let r = row + dr;
  let c = col + dc;
  let cnt = 0;

  while (
    r >= 0 && r < SIZE &&
    c >= 0 && c < SIZE &&
    board[r][c] === player
  ) {
    cnt++;
    r += dr;
    c += dc;
  }

  return cnt;
}

function resetGame() {
  initBoard();
}

// ================= AI BACKEND =================
function requestAIMove() {
  // 🔗 Ví dụ API backend AI
  // Backend nhận board hiện tại và trả về nước đi cho AI

  /*
  fetch(`${API_URL}/ai-move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board })
  })
  .then(res => res.json())
  .then(({ row, col }) => applyAIMove(row, col));
  */

  // ====== DEMO LOCAL (AI ngẫu nhiên) ======
  setTimeout(() => {
    const empty = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === '') empty.push([r, c]);
      }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    applyAIMove(r, c);
  }, 300);
}

function applyAIMove(row, col) {
  if (gameOver) return;

  board[row][col] = aiPlayer;

  const index = row * SIZE + col;
  boardElement.children[index].textContent = aiPlayer;

  if (checkWin(row, col, aiPlayer)) {
    statusElement.textContent = 'AI thắng!';
    gameOver = true;
    return;
  }

  statusElement.textContent = `Lượt: ${humanPlayer}`;
}

// ================= BACKEND (PLACEHOLDER) =================
// function sendMoveToBackend(row, col, player) {
//   fetch(`${API_URL}/move`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ row, col, player })
//   });
// }

initBoard();

// Attach reset button listener (prefer JS over inline `onclick`)
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', resetGame);
}