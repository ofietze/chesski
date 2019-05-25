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
        case "p": if (board[i].color == "w") {score--} else {score++};break;
        // case "b":
        // case "n":board[i].color == "w" ? score-=3 : score+=3;break;
        // case "r":board[i].color == "w" ? score-=5 : score+=5;break;
        // case "n":board[i].color == "q" ? score-=9 : score+=9;break;
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

    if (utilityArr[i] >= max) {
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
            console.log("draw")
          } else if (chess.game_over()) {
            console.log("game over");;
          } else {
            event.chessboard.disableMoveInput()
            setTimeout(() => {
                event.chessboard.setPosition(chess.fen())
                const possibleMoves = chess.moves({verbose: true})
                if (possibleMoves.length > 0) {
                    // choose the best possible move accordinh to the given
                    // heuristic
                    chess.move(possibleMoves[minimaxDecision(possibleMoves)])
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
