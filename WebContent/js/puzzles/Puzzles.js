function PuzzleCombination(puzzle) {
	this.id;
	this.solution = {};
	this.state = {};
	this.values = {};
	this.special = {};
	this.solvedEvent = [];
		
	this.update = function(effect) {
		if (this.state[effect.componentID] != null) {
			if (effect.type == "UPDATE") {
				this.state[effect.componentID] = this.state[effect.componentID] + parseInt(effect.increment);
				this.state[effect.componentID] = this.special.wraparound ? this.state[effect.componentID] % Object.keys(this.values[effect.componentID].values).length : this.state[effect.componentID];
				PuzzleHandler.broadcast(this.id, effect.value);
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
		var res = {};
		for (var state in this.state) {
			res[state] = this.values[state].values[this.state[state]];
		}
		return res;
	}
	
	this.getStateValue = function(componentID) {
		return this.getState()[componentID];
	}
	
	this.id = puzzle.id;
	
	for (var stateID in puzzle.defaults) {
		this.state[stateID] = parseInt(puzzle.defaults[stateID].value);
		this.solution[stateID] = parseInt(puzzle.solution[stateID].value);
	}
	
	for (var valueID in puzzle.values) {
		this.values[valueID] = puzzle.values[valueID];
	}
	
	this.special.wraparound = true;
		
	this.solvedEvent = puzzle.complete;
			
	return this;
}

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