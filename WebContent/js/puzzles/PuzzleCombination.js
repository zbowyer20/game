function PuzzleCombination(puzzle) {
	this.solution = {};
	this.state = {};
	this.solvedEvent = [];
		
	this.update = function(effect) {
		if (this.state[effect.componentID]) {
			if (effect.type == "UPDATE") {
				this.state[effect.componentID] = "" + (parseInt(this.state[effect.componentID]) + parseInt(effect.increment));
			}
		}
	},
	
	this.solved = function() {
		for (var id in this.state) {
			if (this.state[id] != this.solution[id]) {
				return false;
			}
		}
		return true;
	}
	
	this.getState = function() {
		return this.state;
	}
	
	for (var stateID in puzzle.defaults) {
		this.state[stateID] = puzzle.defaults[stateID].value;
		this.solution[stateID] = puzzle.solution[stateID].value;
	}
	
	this.solvedEvent = puzzle.complete;
			
	return this;
}