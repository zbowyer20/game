function EventRemovedItem(event, deferred) {
	var item;
	var def;
			
	item = ItemHandler.items[event.id];
	def = deferred;
	
	this.playResult = function() {
		player.removeItem(item);
		ItemContainer.update(player.getHeldItem());
		AudioManager.play(event.audio);
		deferred.resolve('complete');
	}
		
	return this;
}