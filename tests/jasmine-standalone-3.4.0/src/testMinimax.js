describe("Minimax", function(){
  const chessTest = new Chess();

  it("should show the next moves", function(){
    var possibleMoves = chessTest.moves({verbose: true});
    expect(possibleMoves.length).toBeGreaterThan(0);
  });
});
