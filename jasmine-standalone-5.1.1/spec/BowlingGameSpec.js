describe("Bowling game", function() {
      
    // UNE instance de jeu 
    var game;

    beforeEach(function(){
        game = new BowlingGame();
    })

    // n = nombre de lancers  , pins = les touchers
    function rollMany(n, pins){
        for(var i= 0; i<n; i++){
            game.roll(pins)
        }
    }


    // TEST ATTENDU 
    it("should handle a gutter game", function() {
        // test 

        // le joueur a le droit a 20 lancers et touche 0 quilles
        // fonction lancer la balle rollMany
        rollMany(20, 0);

        // jattends que le score du jeu est = à 0 
        expect(game.score()).toEqual(0);
    });
    
    // it("should properly calculate a strike", function () {
    //     // test
    // });
    
    // it("should properly calculate a spare", function () {
    //     // test
    // });
        
});