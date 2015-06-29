function EventGainedItem(event, deferred) {
	var item;
	var def;
			
	item = ItemHandler.items[event.id];
	def = deferred;
	
	this.playResult = function() {
		player.addItem(item);
		ItemContainer.update(player.getHeldItem());
		AudioManager.play(event.audio);
		PopupHandler.addItem(item).display().then(function() {
			deferred.resolve('complete');
		})
	}
		
	return this;
}