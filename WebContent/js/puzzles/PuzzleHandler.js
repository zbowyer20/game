var PuzzleHandler = {
		puzzles: [],
		
		convertJsonToPuzzles: function(json) {
			for (jsonPuzzle in json) {
				if (jsonPuzzle.type == "COMBINATION") {
					puzzles[jsonPuzzle.id] = new PuzzleCombination(jsonPuzzle);
				}
			}
			return true;
		}
}