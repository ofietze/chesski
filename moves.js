import {INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR, Chessboard} from
"./node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js"

const chess = new Chess()

function random(possibleMoves){
  return Math.floor(Math.random() * possibleMoves.length);
}

function utility(move) {
  var chessCopy = new Chess(chess.fen());
  chessCopy.move({from: move.from, to: move.to});
  var board = chessCopy.board();
  var score = 0;

  // assuming we are black
  for (var i = 0; i < board.length; i++) {
    if(board[i] != null){
      switch (board[i].type) {
        case "p": if(board[i].color == "w") {score--} else {score++};break;
        case "b":
        case "n": if(board[i].color == "w") {score-=3} else {score+=3};break;
        case "r": if(board[i].color == "w") {score-=5} else {score+=5};break;
        case "q": if(board[i].color == "w") {score-=9} else {score+=9};break;
        default: break;
      }
    }
  }
  return score;
}

function maxValue(possibleMoves){
  var utilityArr = [possibleMoves.length];
  var max = 0;

  for (var i = 0; i < possibleMoves.length; i++) {
    utilityArr[i] = utility(possibleMoves[i]);

    if (utilityArr[i] >= utilityArr[max]) {
      max = i;
    }
  }
  console.log("utility", utilityArr);
  console.log("max", max);
  return max;
}

function minimaxDecision(possibleMoves){
  return maxValue(possibleMoves)
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
            console.log("turn", chess.turn());
          } else {
            event.chessboard.disableMoveInput()
            setTimeout(() => {
                event.chessboard.setPosition(chess.fen())
                const possibleMoves = chess.moves({verbose: true})
                if (possibleMoves.length > 0) {
                    // choose the best possible move accordinh to the given
                    // heuristic
                    var heuristic = document.querySelector('input[name = "heuristic"]:checked').value;
                    if (heuristic == "rnd") {
                        chess.move(possibleMoves[random(possibleMoves)])
                    } else {
                        chess.move(possibleMoves[minimaxDecision(possibleMoves)])
                    }
                    event.chessboard.enableMoveInput(inputHandler, COLOR.white)
                    event.chessboard.setPosition(chess.fen())
                }
            })
          }
        } else {
            console.warn("invalid move", move)
        }
        return result
    } else {
        return true
    }
}

const board = new Chessboard(document.getElementById("board"), {
    position: chess.fen(),
    sprite: {url: "node_modules/cm-chessboard/assets/images/chessboard-sprite.svg"},
    orientation: COLOR.white,
    moveInputMode: MOVE_INPUT_MODE.dragPiece
})
board.enableMoveInput(inputHandler, COLOR.white)
