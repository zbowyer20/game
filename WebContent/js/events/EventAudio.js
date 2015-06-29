function EventAudio(event, deferred) {
	var audio;
	var def;
	
	audio = event.audio;
	def = deferred;
	
	this.playResult = function() {
		if (audio.stop) {
			AudioManager.stop();
		}
		else {
			AudioManager.play(audio);
		}
		def.resolve('complete');
	}
		
	return this;
}