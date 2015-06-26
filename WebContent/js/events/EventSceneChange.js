function EventSceneChange(event, deferred) {
	var id;
	var def;
		
	id = event.id;
	def = deferred;
	
	this.playResult = function() {
		Scene.nextScene(id);
		def.resolve('complete');
	}
		
	return this;
}