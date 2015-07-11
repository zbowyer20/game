function EventPuzzleAttempt(event, deferred) {
	var puzzle;
	var def;
		
	puzzle = PuzzleHandler.getPuzzle(event.puzzleID);
	def = deferred;
	
	this.playResult = function() {
		puzzle.update(event.effect);
		def.resolve('complete');
		if (puzzle.solved()) {
			console.log('solved');
		}
		else {
			console.log('not solved');
		}
	}
		
	return this;
}