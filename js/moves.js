import {INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR, Chessboard} from
"./Chessboard.js"
import {random, minimaxDecision, alphaBeta} from './algo.js'

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
    position: chesski.fen(),
    sprite: {url: "assets/images/chessboard-sprite.svg"},
    orientation: COLOR.white,
    moveInputMode: MOVE_INPUT_MODE.viewOnly
})

var started = false;
var paused = true;
var graphVisible = false;
window.onload = function() {
    document.getElementById("kibuttonStart").onclick = function fun() {
        if (!started){
          paused = false;
          aiMatch(chesski);
        } else {
          paused = !paused;
        }

        if (paused){
          document.getElementById("kibuttonStart").value = "Continue"
        } else {
          // continue match
          aiMatch(chesski);
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

    document.getElementById("graph").style.display = "none";

    document.getElementById("graphCheck").onclick = function fun(){
      if (graphVisible) document.getElementById("graph").style.display = "none";
      else document.getElementById("graph").style.display = "block";

      graphVisible = !graphVisible;
    }
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
                      // alpha beta
                      case "ab": chess.move(possibleMoves[alphaBeta(chess)]);
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

async function aiMatch(chessgame){
  while (!chessgame.game_over() && !paused) {
      const possibleMoves = chessgame.moves({verbose: true})
      if (possibleMoves.length > 0) {
          // choose the best possible move according to the given
          // heuristic
          var heuristic = document.querySelector('input[name="heuristic"]:checked').value;

          // TODO add alpha beta
          switch (heuristic) {
            // minimax
            case "mm":  chessgame.move(possibleMoves[minimaxDecision(chessgame)]);
              break;
            default:
              chessgame.move(possibleMoves[random(possibleMoves)]);
          }
        kiboard.setPosition(chessgame.fen())
        await sleep(1000);
      }
  }

  if(chessgame.in_draw()){
    document.getElementById("outputki").innerHTML = "Draw";
  } else if (chessgame.game_over()) {
    var winMessage = "Game over";
    if (chessgame.turn() == "w") {
      winMessage += " Black won.";
    } else {
      winMessage += " White won.";
    }
    document.getElementById("outputki").innerHTML = winMessage;
  }
}
