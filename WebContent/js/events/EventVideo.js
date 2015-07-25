function EventVideo(event, deferred) {
	var video;
	var def;
	
	video = event.video;
	def = deferred;
	
	this.playResult = function() {
		var vid = convertVideoToScaledBitmap(videos[event.id], 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
		Scene.containers.topLayer.addChild(vid);
		vid.image.onended = function() {
			vid.image.pause();
			Scene.containers.topLayer.removeChild(vid);
			def.resolve('complete');
		};
	}
		
	return this;
}