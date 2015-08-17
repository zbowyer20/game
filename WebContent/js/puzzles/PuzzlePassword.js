function PuzzlePassword(puzzle) {
	this.id;
	this.solution = "";
	this.state = "";
	this.solvedEvent = [];
		
	this.update = function(effect) {
		if (effect.type == "APPEND") {
			this.state += effect.value;
			PuzzleHandler.broadcast(this.id, effect.componentID);
		}
	},
	
	this.solved = function() {
		var len = this.state.length;
		return (len >= this.solution.length) && this.state.substring(len-this.solution.length, len) == this.solution;
	}
	
	this.getState = function() {
		return this.state;
	}
	
	this.getStateValue = function(componentID) {
		return this.getState().substring(componentID, componentID + 1)
	}
	
	this.id = puzzle.id;
	this.solution = puzzle.solution;		
	this.solvedEvent = puzzle.complete;
			
	return this;
}