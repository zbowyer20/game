var PuzzleHandler = {
		puzzles: {},
		
		addPuzzles: function(json) {
			for (jsonPuzzle in json) {
				if (json[jsonPuzzle].type == "COMBINATION") {
					this.puzzles[json[jsonPuzzle].id] = new PuzzleCombination(json[jsonPuzzle]);
				}
				if (json[jsonPuzzle].type == "PASSWORD") {
					this.puzzles[json[jsonPuzzle].id] = new PuzzlePassword(json[jsonPuzzle]);
				}
			}
			return true;
		},

		getPuzzle: function(id) {
			return this.puzzles[id];
		},
		
		broadcast: function(puzzleID, componentID) {
			$(document).trigger(puzzleID + "_" + componentID);
		}
}