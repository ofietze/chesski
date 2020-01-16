describe("utility", function(){
  it("base board has utility of 0", function() {
    var chess = new Chess();
    chess.turn = "w";
    expect(utility(chess)).toEqual(0);
  })

  it("white should have a utility of 1", function() {
      // Two kings and one white pawn
    var chess = new Chess("3k4/3P4/8/8/8/8/8/3K4 w - - 0 1");
    chess.turn = "w";
    expect(utility(chess)).toEqual(1);
  })

  it("black should have a utility of -1", function() {
      // Two kings and one white pawn
    var chess = new Chess("3k4/3P4/8/8/8/8/8/3K4 w - - 0 1");
    chess.turn = "b";
    expect(utility(chess)).toEqual(-1);
  })

  it("white should have a utility of 21", function() {
    // Two kings and one of every white piece
    var chess = new Chess("k7/8/8/8/8/8/8/PRBKQN2 w - - 0 1");
    chess.turn = "w";
    expect(utility(chess)).toEqual(21);
  })

  it("black should have a utility of -15", function() {
    // Two kings and one of every white piece and one black bishop
    var chess = new Chess("kb6/8/8/8/8/8/8/PRBKQN2 w - - 0 1");
    chess.turn = "b";
    expect(utility(chess)).toEqual(-18);
  })

})
