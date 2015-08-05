function EventUpdateBackground(event, deferred) {
	var area;
	var def;
	
	area = Scene.components.areas[event.id];
	def = deferred;
	
	this.playResult = function() {
		console.log('updating background');
		if (area) {
			area.clearBackground();
			area.setBackground(event.newId);
		}
		else {
			console.error('Area could not be found')
		}
		def.resolve('complete');
	}
		
	return this;
}