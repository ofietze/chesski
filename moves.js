import {INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR, Chessboard} from
"./js/Chessboard.js"

var movesChecked = 0;
const chess = new Chess();
const board = new Chessboard(document.getElementById("board"), {
    position: chess.fen(),
    sprite: {url: "assets/images/chessboard-sprite.svg"},
    orientation: COLOR.white,
    moveInputMode: MOVE_INPUT_MODE.dragPiece
})
board.enableMoveInput(inputHandler, COLOR.white)

const chesski = new Chess();
const kiboard = new Chessboard(document.getElementById("kiboard"), {
    position: chess.fen(),
    sprite: {url: "assets/images/chessboard-sprite.svg"},
    orientation: COLOR.white,
    moveInputMode: MOVE_INPUT_MODE.viewOnly
})

var started = false;
var paused = true;
window.onload = function() {
    document.getElementById("kibuttonStart").onclick = function fun() {
        if (!started){
          paused = false;
          aiMatch();
        } else {
          paused = !paused;
        }

        if (paused){
          document.getElementById("kibuttonStart").value = "Continue"
        } else {
          // continue match
          aiMatch();
          document.getElementById("kibuttonStart").value = "Pause"
        }
        started = true;
    }
    document.getElementById("kibuttonStop").onclick = function fun() {
        chesski.reset();
        kiboard.setPosition(chesski.fen());
        paused = true;
        document.getElementById("kibuttonStart").value = "Start ai match"
    }
}

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

function inputHandler(event) {
    if (event.type === INPUT_EVENT_TYPE.moveDone) {
        const move = {from: event.squareFrom, to: event.squareTo}
        const result = chess.move(move)
        if (result) {
          if(chess.in_draw()){
            document.getElementById("output").innerHTML = "Draw";
          } else if (chess.game_over()) {
            var winMessage = "Game over";
            if (chess.turn() == "w") {
              winMessage += " Black won.";
            } else {
              winMessage += " White won.";
            }
            document.getElementById("output").innerHTML = winMessage;
          } else {
            // make the next move
            event.chessboard.disableMoveInput()
            setTimeout(() => {
                event.chessboard.setPosition(chess.fen())
                const possibleMoves = chess.moves({verbose: true})
                if (possibleMoves.length > 0) {
                    // choose the best possible move according to the given
                    // heuristic
                    var heuristic = document.querySelector('input[name="heuristic"]:checked').value;

                    switch (heuristic) {
                      // minimax
                      case "mm":  chess.move(possibleMoves[minimaxDecision(chess)]);
                        break;
                      default:
                        chess.move(possibleMoves[random(possibleMoves)]);
                    }
                    event.chessboard.enableMoveInput(inputHandler, COLOR.white)
                    event.chessboard.setPosition(chess.fen())
                }
            })
          }
        } else {
            document.getElementById("info").innerHTML = "invalid move", move;
        }
        return result
    } else {
        return true
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function aiMatch(){
  while (!chesski.game_over() && !paused) {
      const possibleMoves = chesski.moves({verbose: true})
      if (possibleMoves.length > 0) {
          // choose the best possible move according to the given
          // heuristic
          var heuristic = document.querySelector('input[name="heuristic"]:checked').value;

          switch (heuristic) {
            // minimax
            case "mm":  chesski.move(possibleMoves[minimaxDecision(chesski)]);
              break;
            default:
              chesski.move(possibleMoves[random(possibleMoves)]);
          }
        kiboard.setPosition(chesski.fen())
        await sleep(1000);
      }
  }

  if(chesski.in_draw()){
    document.getElementById("outputki").innerHTML = "Draw";
  } else if (chesski.game_over()) {
    var winMessage = "Game over";
    if (chesski.turn() == "w") {
      winMessage += " Black won.";
    } else {
      winMessage += " White won.";
    }
    document.getElementById("outputki").innerHTML = winMessage;
  }
}
