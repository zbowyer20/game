function EventCutscene(event, deferred) {
	var cutscene;
	var def;
		
	cutscene = CutsceneHandler.findCutscene(event.id);
	def = deferred;
	
	this.playResult = function() {
		ItemContainer.hide();
		var parameters = event.parameters ? this.loadParameters(event.parameters) : null;
		CutsceneHandler.initCutscene(cutscene, parameters).then(function() {
			ItemContainer.show();
			def.resolve('complete');
		});
	}
		
	this.loadParameters = function(parameters) {
		var params = [];
		for (var i = 0; i < parameters.length; i++) {
			params = this.loadParameter(params, parameters[i]);
		}
		return params;
	}
	
	this.loadParameter = function(parameters, parameter) {
		switch (parameter.type) {
			case "SINGLE": 
				return parameters.push(parameter.value);
				break;
			case "PUZZLE-STATE":
				var puzzleState = PuzzleHandler.getPuzzle(parameter.id).getState();
				for (var opts in puzzleState) {
					parameters.push(puzzleState[opts]);
				}
				return parameters;
				break;
		}
	}
	
	return this;
}