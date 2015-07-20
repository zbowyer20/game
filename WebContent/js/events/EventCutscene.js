function EventCutscene(event, deferred) {
	var cutscene;
	var def;
		
	cutscene = CutsceneHandler.findCutscene(event.id);
	def = deferred;
	
	this.playResult = function() {
		CutsceneHandler.initCutscene(cutscene, event.parameters).then(function() {
			def.resolve('complete');
		});
	}
		
	return this;
}