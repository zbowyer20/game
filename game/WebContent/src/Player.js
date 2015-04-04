function Player() {
	var inventory = [];
	
	this.addItem = function(item) {
		inventory.push(item);
		return this;
	}
	
	this.removeItem = function(item) {
		var foundItem = false;
		var index = 0;
		while ((!foundItem) && (index < inventory.length)) {
			if (inventory[i].id == item.id) {
				foundItem = true;
			}
			else {
				index++;
			}
		}
		if (foundItem) {
			inventory.splice(index, 1);
		}
		return this;
	}
	
	this.getInventory = function() {
		return inventory;
	}
	
	return this;
}