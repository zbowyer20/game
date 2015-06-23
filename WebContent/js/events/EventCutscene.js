function EventCutscene(json, deferred) {
	var cutscene;
	var def;
		
	cutscene = CutsceneHandler.findCutscene(json.id);
	def = deferred;
	
	this.playResult = function() {
		CutsceneHandler.initCutscene(cutscene).then(function() {
			def.resolve('complete');
		});
	}
		
	return this;
}