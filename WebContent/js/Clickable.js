function Clickable(json) {
	this.clickable = json;
	this.bitmap;
	
	this.init = function() {
		var self = this;
		this.bitmap = this.createClickableImage(this.clickable.type);
		this.bitmap.addEventListener("click", function() {
			if (checkPriority(ITEM_PRIORITY)) {
				if (!self.clickable.persist) {
					self.removeFromStage();
				}
				if (self.clickable.type == CLICKABLE_ITEM) {
					self.addToInventory();
				}
				self.loadClickableClickResult();
			}
		});
		return this.bitmap;
	}
	
	this.removeFromStage = function() {
		console.log(Scene.components.clickables);
		Scene.components.clickables[this.clickable.id].addToStage = false;
		console.log(Scene.container);
		//var clickableContainer = Scene.container.getChildByName("sceneContainer").getChildByName("clickableContainer");
		var clickableContainer = Scene.container.getChildByName("clickableContainer");
		clickableContainer.removeChild(this.bitmap);
		stage.update();
	}
	
	this.addToInventory = function() {
		var item = items[this.clickable.id];
		if (item) {
			player.addItem(item);
			updateItemContainer();
		}
	}
	
	/*
	 * Create a clickable image
	 * @param clickable The JSON object for the clickable
	 * @param multiplier The number of screen widths away this clickable is
	 * 					-1 for clickable to the left
	 * 					0 for clickable onscreen
	 * 					1 for clickable to the right
	 * @returns Bitmap The bitmap of the image
	 */
	this.createClickableImage = function() {
		var image = getImageById(this.clickable.id);
		
		var clickableBit = convertImageToScaledBitmap(image, ((this.clickable.location.x * DPR)), this.clickable.location.y * DPR, this.clickable.dimensions.width * DPR, this.clickable.dimensions.height * DPR);
		return clickableBit;
	}
	
	this.loadClickableClickResult = function() {
		if (!this.clickable.onclick) {
			return false;
		}
		//var results = getCutsceneToPlay();
		//clickEvent.clickable = this.clickable;
		//clickEvent.index = 0;
		//clickEvent.events = results;
		//playClickableClickResult();
	}
	
	//this.clickable = function() {
		
	//}
	
	return this;
}