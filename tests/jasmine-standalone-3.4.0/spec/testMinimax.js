describe("negaMaxValue", function(){
  it("black should take the pawn", function(){
    var chess = new Chess("3k4/3P4/8/8/8/8/8/3K4 b - - 0 1");
    chess.turn = "b";
    var possibleMoves = chess.moves({verbose: true});

    expect(possibleMoves[negaMaxValue(chess, 1)[0]]).toEqual("3");
  });
});

describe("Minimax", function(){

  it("should show the next moves", function(){
    var chess = new Chess();
    var possibleMoves = chess.moves({verbose: true});
    expect(possibleMoves.length).toBeGreaterThan(0);
  });

  it("black should take the pawn", function(){
    var chess = new Chess("3k4/3P4/8/8/8/8/8/3K4 b - - 0 1");
    chess.turn = "b";
    var possibleMoves = chess.moves({verbose: true});
    chess.move(possibleMoves[minimaxDecision(chess, 1)]);

    expect(chess.fen()).toEqual("3k4/8/8/8/8/8/8/3K4 w - - 0 1");
    expect("\n"+chess.ascii()).toEqual("3");
  });
});
