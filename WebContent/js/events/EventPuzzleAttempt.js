function EventPuzzleAttempt(event, deferred) {
	var puzzle;
	var def;
		
	puzzle = PuzzleHandler.getPuzzle(event.puzzleID);
	def = deferred;
	
	this.playResult = function() {
		console.log('att');
		puzzle.update(event.effect);
		if (puzzle.solved()) {
			console.log('solved');
			new Clickable().loadClickableClickResult(puzzle.solvedEvent).then(function() {
				def.resolve('complete');
			});
			
		}
		else {
			console.log('not solved');
			def.resolve('complete');

		}
	}
		
	return this;
}