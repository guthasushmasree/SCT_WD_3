const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const modeTitle = document.getElementById("modeTitle");
const player2Title = document.getElementById("player2Title");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawScoreEl = document.getElementById("drawScore");

let gameMode = "pvp";
let currentPlayer = "X";
let gameActive = true;

let boardState = ["", "", "", "", "", "", "", "", ""];

let scores = {
    X: 0,
    O: 0,
    Draw: 0
};

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

function startGame(mode){

    gameMode = mode;

    homeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    modeTitle.textContent =
        mode === "pvp"
        ? "👥 Player vs Player"
        : "🤖 Player vs Computer";

    player2Title.textContent =
        mode === "pvp"
        ? "⭕ O"
        : "🤖 Computer";

    restartGame();
}

function goHome(){

    gameScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");

}

cells.forEach(cell=>{
    cell.addEventListener("click",handleCellClick);
});

restartBtn.addEventListener("click",restartGame);

function handleCellClick(e){

    const index = e.target.dataset.index;

    if(boardState[index]!=="" || !gameActive)
        return;

    makeMove(index,currentPlayer);

    if(gameMode==="cpu" &&
       currentPlayer==="O" &&
       gameActive){

        setTimeout(computerMove,500);
    }

}

function makeMove(index, player){

    boardState[index] = player;

    cells[index].textContent = player;

    if(player === "X"){
        cells[index].classList.add("x");
    }else{
        cells[index].classList.add("o");
    }

    checkWinner();
}

function checkWinner(){

    let roundWon=false;
    let winningPattern=[];

    for(let combo of winningCombinations){

        const[a,b,c]=combo;

        if(
            boardState[a] &&
            boardState[a]===boardState[b] &&
            boardState[a]===boardState[c]
        ){

            roundWon=true;
            winningPattern=combo;
            break;
        }
    }

    if(roundWon){

        winningPattern.forEach(i=>{
            cells[i].classList.add("win");
        });

        statusText.textContent=
            `🎉 Player ${currentPlayer} Wins!`;

        scores[currentPlayer]++;

        updateScore();

        gameActive=false;

        return;
    }

    if(!boardState.includes("")){

        statusText.textContent="🤝 Match Draw";

        scores.Draw++;

        updateScore();

        gameActive=false;

        return;
    }

    currentPlayer=currentPlayer==="X"?"O":"X";

    if(gameMode==="cpu" && currentPlayer==="O")
        statusText.textContent="🤖 Computer Turn";
    else
        statusText.textContent=`Player ${currentPlayer} Turn`;

}

function updateScore(){

    xScoreEl.textContent=scores.X;
    oScoreEl.textContent=scores.O;
    drawScoreEl.textContent=scores.Draw;

}
function computerMove() {

    let emptyCells = [];

    boardState.forEach((cell, index) => {
        if (cell === "") {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const move = emptyCells[randomIndex];

    makeMove(move, "O");
}

function restartGame() {

    boardState = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameActive = true;

    cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
    cell.classList.remove("x");
    cell.classList.remove("o");
});

    statusText.textContent = "Player X Turn";
}

restartGame();