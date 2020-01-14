describe("Minimax", function(){

  it("should show the next moves", function(){
    var chess = new Chess();
    var possibleMoves = chess.moves({verbose: true});
    expect(possibleMoves.length).toBeGreaterThan(0);
  });

  it("black should take the pawn", function(){
    var chess = new Chess("8/8/8/8/8/3q4/3P4/8");
    chess.turn = "b";
    var possibleMoves = chess.moves({verbose: true});

    chess.move(possibleMoves[minimaxDecision(chess, 1)]);
    expect(chess.fen()).toEqual("8/8/8/8/8/8/3q4/8");
  });
});
