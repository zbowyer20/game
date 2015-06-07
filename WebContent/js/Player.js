function Player() {
	var inventory = [];
	var files = [];
	var heldItem;
	
	this.addItem = function(item) {
		inventory.push(item);
		this.setHeldItem(item);
		return this;
	}
	
	this.removeItem = function(item) {
		var index = this.itemIndexInInventory(item.id);
		if (index != null) {
			inventory.splice(index, 1);
		}
		return this;
	}
	
	this.itemIndexInInventory = function(id) {
		var foundItem = false;
		var index = 0;
		while ((!foundItem) && (index < inventory.length)) {
			if (inventory[index].id == id) {
				foundItem = true;
			}
			else {
				index++;
			}
		}
		return foundItem ? index : null;
	}
	
	this.hasItem = function (itemId) {
		return this.itemIndexInInventory(itemId) != null;
	}
	
	this.getInventory = function() {
		return inventory;
	}
	
	this.setHeldItem = function (item) {
		heldItem = item;
	}
	
	this.getHeldItem = function() {
		return heldItem;
	}
	
	this.addFile = function(file) {
		files.push(file);
	}
	
	this.getFiles = function() {
		return files;
	}
	
	return this;
}