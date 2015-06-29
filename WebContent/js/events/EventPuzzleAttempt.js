function EventPuzzleAttempt(event, deferred) {
	var puzzle;
	var def;
	
	puzzle = PuzzleHandler.findPuzzle(event.puzzle-id);
	def = deferred;
	
	this.playResult = function() {
		puzzle.update(event.effect);
		def.resolve('complete');
	}
		
	return this;
}