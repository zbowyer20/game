function EventCutscene(json, deferred) {
	var cutscene;
	var def;
		
	cutscene = CutsceneHandler.findCutscene(json.id);
	def = deferred;
	
	this.playResult = function() {
		AudioManager.play(json.audio)
		CutsceneHandler.initCutscene(cutscene).then(function() {
			def.resolve('complete');
		});
	}
		
	return this;
}