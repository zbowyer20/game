var ItemHandler = {
		items: {},
		
		addItems: function(items) {
			for (var i = 0; i < items.length; i++) {
				this.items[items[i].id] = new Item(items[i].id, items[i].name, items[i].description, images[items[i].id]);
			}
		}
}