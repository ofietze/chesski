var movesChecked = 0; // TODO integrate this into a state of chess state and data about the game

function random(possibleMoves){
  return Math.floor(Math.random() * possibleMoves.length);
};

function utility(state) {
  movesChecked++;
  var board = state.board();
  var score = 0;

  for (var i = 0; i < board.length; i++) {
    if (board[i] != null) {
      if(state.turn() === "b"){
        switch (String(board[i].type)) {
          case "p": if(board[i].color === "w") {score--} else {score++};break;
          case "b":
          case "n": if(board[i].color === "w") {score-=3} else {score+=3};break;
          case "r": if(board[i].color === "w") {score-=5} else {score+=5};break;
          case "q": if(board[i].color === "w") {score-=9} else {score+=9};break;
          case "k": if(board[i].color === "w") {score-=12} else {score+=12};break;
          default: break;
        }
      } else if(state.turn() === "w") {
        switch (String(board[i].type)) {
          case "p": if(board[i].color === "w") {score++;} else {score--};break;
          case "b":
          case "n": if(board[i].color === "w") {score+=3} else {score-=3};break;
          case "r": if(board[i].color === "w") {score+=5} else {score-=5};break;
          case "q": if(board[i].color === "w") {score+=9} else {score-=9};break;
          case "k": if(board[i].color === "w") {score+=12} else {score-=12};break;
          default: break;
        }
      }
    }
  }
  return score;
};

// @param {chess} state:    a chess state
// @param {int}   maxDepth: how many moves should be checked
// @return {int[]}: containing the index of the highest value move and the value itself
function negaMaxValue(state, maxDepth){
  if (maxDepth == 0){
    return new Array(0, utility(state))
  } else {
    // Copy chess game state
    var chessState = new Chess(state.fen());
    var moves = chessState.moves({verbose: true})
    // Make array one cell to big to save lowest int
    var utilityArr = [moves.length+1];
    utilityArr[moves.length] = Number.MIN_SAFE_INTEGER;
    var maxIndex = moves.length; // init max to lowest int

    // Apply each move and check it's utility
    // Might go down several levels of recursion depending on maxDepth
    for (var i = 0; i < moves.length; i++) {
      chessState.move({from: moves[i].from, to: moves[i].to})
      // Call minValue and compare it
      utilityArr[i] = Math.max(utilityArr[moves.length], negaMaxValue(chessState,
        maxDepth-1)[1]*-1);
      chessState.undo()
      // Update highest value move
      if (utilityArr[i] >= utilityArr[maxIndex]) {
        maxIndex = i;
      }
    }
    return new Array(maxIndex, utilityArr[maxIndex]);
  }
};

function minimaxDecision(chessGame, maxDepth){
  movesChecked = 0;
  return negaMaxValue(chessGame, maxDepth)[0];
};

function displayMinimaxDecision(chessGame) {
  movesChecked = 0;
  const res = minimaxDecision(chessGame, document.getElementById("lookahead").value)

  document.getElementById("info").innerHTML = movesChecked + " moves Checked";
  return res;
}

export { random, displayMinimaxDecision }
