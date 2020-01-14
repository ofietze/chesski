describe("utility", function(){
  it("white should have a utility of -8", function() {
    var chess = new Chess("8/8/8/8/8/3q4/3P4/8");
    chess.turn = "w";
    expect(chess.fen()).toEqual("8/8/8/8/8/8/3q4/8");
    expect(utility(chess)).toEqual(-8);
  })

  it("black should have a utility of 8", function() {
    var chess = new Chess("8/8/8/8/8/3q4/3P4/8");
    chess.turn = "b";
    expect(chess.fen()).toEqual("8/8/8/8/8/8/3q4/8");
    expect(utility(chess)).toEqual(8);
  })
})
