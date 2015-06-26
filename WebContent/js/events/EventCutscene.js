function EventCutscene(event, deferred) {
	var cutscene;
	var def;
		
	cutscene = CutsceneHandler.findCutscene(event.id);
	def = deferred;
	
	this.playResult = function() {
		CutsceneHandler.initCutscene(cutscene).then(function() {
			def.resolve('complete');
		});
	}
		
	return this;
}