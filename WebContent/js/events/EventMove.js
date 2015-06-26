function EventSceneChange(event, deferred) {
	var destination;
	var def;
		
	destination = event.destination;
	def = deferred;
	
	this.playResult = function() {
		Scene.turn(Scene.components.areas[destination], false);
		deferred.resolve('complete');
	}
		
	return this;
}