const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const line = document.getElementById("line");

const modeModal = document.getElementById("modeModal");
const resultModal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");

let board = Array(9).fill("");
let player = "X";
let active = false;
let vsBot = false;

/* START */
function startGame(bot){
  vsBot = bot;
  modeModal.classList.add("hidden");
  resetGame();
}

/* RESET */
function resetGame(){
  board.fill("");
  player="X";
  active=true;

  cells.forEach(c=>{
    c.textContent="";
    c.classList.remove("win");
  });

  line.style.transform="scaleX(0)";
  resultModal.classList.add("hidden");

  statusText.textContent = vsBot ? "Your Turn (X)" : "Player X's turn";
}

/* CLICK */
cells.forEach(cell=>{
  cell.onclick=()=>{
    const i=cell.dataset.i;
    if(!active || board[i]) return;

    move(i,player);
    if(checkWin()) return;

    switchPlayer();

    if(vsBot && player==="O"){
      setTimeout(botMove,300);
    }
  };
});

/* MOVE */
function move(i,p){
  board[i]=p;
  cells[i].textContent=p;
}

/* MINIMAX AI */
function botMove(){
  let bestScore = -Infinity;
  let moveIndex;

  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]="O";
      let score = minimax(board,0,false);
      board[i]="";
      if(score>bestScore){
        bestScore=score;
        moveIndex=i;
      }
    }
  }

  move(moveIndex,"O");

  if(checkWin()) return;
  switchPlayer();
}

function minimax(board,depth,isMax){
  let result = evaluate();
  if(result!==null) return result;

  if(isMax){
    let best = -Infinity;
    for(let i=0;i<9;i++){
      if(board[i]===""){
        board[i]="O";
        best = Math.max(best,minimax(board,depth+1,false));
        board[i]="";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for(let i=0;i<9;i++){
      if(board[i]===""){
        board[i]="X";
        best = Math.min(best,minimax(board,depth+1,true));
        board[i]="";
      }
    }
    return best;
  }
}

function evaluate(){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(let [a,b,c] of wins){
    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      return board[a]==="O"?10:-10;
    }
  }

  if(!board.includes("")) return 0;
  return null;
}

/* SWITCH */
function switchPlayer(){
  player = player==="X"?"O":"X";

  if(vsBot){
    statusText.textContent = player==="X"?"Your Turn (X)":"AI Thinking...";
  } else {
    statusText.textContent = `Player ${player}'s turn`;
  }
}

/* WIN CHECK */
function checkWin(){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(let combo of wins){
    const [a,b,c]=combo;

    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");

      drawLine(combo);
      endGame();
      return true;
    }
  }

  if(!board.includes("")){
    endGame(true);
    return true;
  }
  return false;
}

/* STRIKE */
function drawLine([a,b,c]){
  const size=110, gap=10;

  const center=i=>{
    return {
      x:(i%3)*(size+gap)+size/2,
      y:Math.floor(i/3)*(size+gap)+size/2
    };
  };

  const s=center(a), e=center(c);
  const dx=e.x-s.x, dy=e.y-s.y;

  const length=Math.sqrt(dx*dx+dy*dy);
  const angle=Math.atan2(dy,dx)*180/Math.PI;

  line.style.width=length+"px";
  line.style.left=s.x+"px";
  line.style.top=s.y+"px";
  line.style.transform=`rotate(${angle}deg) scaleX(1)`;
}

/* END */
function endGame(draw=false){
  active=false;

  resultText.classList.remove("win-text","draw-text");

  let msg;

  if(draw){
    msg="🤝 Draw Game";
    resultText.classList.add("draw-text");
  } else {
    if(vsBot){
      msg = player==="X"?"🎉 You Win!":"🤖 AI Wins!";
    } else {
      msg = `🎉 Player ${player} Wins`;
    }
    resultText.classList.add("win-text");
  }

  resultText.textContent=msg;
  resultModal.classList.remove("hidden");
}

/* MODE */
function openMode(){
  resultModal.classList.add("hidden");
  modeModal.classList.remove("hidden");
}

/* THEME */
const toggle=document.getElementById("themeToggle");

toggle.onclick=()=>{
  document.body.classList.toggle("light");
  const isLight=document.body.classList.contains("light");
  toggle.textContent=isLight?"☀️":"🌙";
  localStorage.setItem("theme",isLight?"light":"dark");
};

(function(){
  if(localStorage.getItem("theme")==="light"){
    document.body.classList.add("light");
    toggle.textContent="☀️";
  }
})();