
function random(possibleMoves){
  return Math.floor(Math.random() * possibleMoves.length);
}

function utility(state) {
  movesChecked++;
  var board = state.board();
  var score = 0;

  for (var i = 0; i < board.length; i++) {
    if(board[i] != null && state.turn() == "b"){
      switch (board[i].type) {
        case "p": if(board[i].color == "w") {score--} else {score++};break;
        case "b":
        case "n": if(board[i].color == "w") {score-=3} else {score+=3};break;
        case "r": if(board[i].color == "w") {score-=5} else {score+=5};break;
        case "q": if(board[i].color == "w") {score-=9} else {score+=9};break;
        case "k": if(board[i].color == "w") {score-=12} else {score+=12};break;
        default: break;
      }
    } else if(board[i] != null && state.turn() == "w"){
      switch (board[i].type) {
        case "p": if(board[i].color == "w") {score++} else {score--};break;
        case "b":
        case "n": if(board[i].color == "w") {score+=3} else {score-=3};break;
        case "r": if(board[i].color == "w") {score+=5} else {score-=5};break;
        case "q": if(board[i].color == "w") {score+=9} else {score-=9};break;
        case "k": if(board[i].color == "w") {score+=12} else {score-=12};break;
        default: break;
      }
    }
  }
  return score;
}

function maxValue(state, maxDepth){
  if (maxDepth == 0){
    return utility(state)
  } else {
    // Copy chess game state
    var chessState = new Chess(state.fen());
    var moves = chessState.moves({verbose: true})
    var utilityArr = [moves.length+1];
    utilityArr[moves.length] = Number.MIN_SAFE_INTEGER;
    var maxIndex = moves.length;

    for (var i = 0; i < moves.length; i++) {
      chessState.move({from: moves[i].from, to: moves[i].to})
      utilityArr[i] = Math.max(utilityArr[maxIndex], minValue(chessState,
        maxDepth-1));
      chessState.undo()
      if (utilityArr[i] >= utilityArr[maxIndex]) {
        maxIndex = i;
      }
    }
    return maxIndex;
  }
}

function minValue(state, maxDepth){
  if (maxDepth == 0){
    return utility(state)
  } else {
    // Copy chess game state
    var chessState = new Chess(state.fen());
    var moves = chessState.moves({verbose: true})
    var utilityArr = [moves.length+1];
    utilityArr[moves.length] = Number.MAX_SAFE_INTEGER;
    var minIndex = moves.length;

    for (var i = 0; i < moves.length; i++) {
      chessState.move({from: moves[i].from, to: moves[i].to})
      utilityArr[i] = Math.min(utilityArr[minIndex], maxValue(chessState,
        maxDepth-1));
      chessState.undo()
      if (utilityArr[i] >= utilityArr[minIndex]) {
        minIndex = i;
      }
    }
    return minIndex;
  }
}

function minimaxDecision(chessGame){
  movesChecked = 0;
  const res = maxValue(chessGame, document.getElementById("lookahead").value)

  document.getElementById("info").innerHTML = movesChecked + " moves Checked";
  console.log(movesChecked);
  return res;
}
