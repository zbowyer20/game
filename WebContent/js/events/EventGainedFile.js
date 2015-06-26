function EventGainedFile(event, deferred) {
	var file;
	var def;
			
	file = FileHandler.files[event.id];
	def = deferred;
	
	this.playResult = function() {
		player.addFile(file);
		PopupHandler.addFile(file).display().then(function() {
			deferred.resolve('complete');
		})
	}
		
	return this;
}