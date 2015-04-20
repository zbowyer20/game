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
		Scene.components.clickables[this.clickable.id].addToStage = false;
		//var clickableContainer = Scene.container.getChildByName("sceneContainer").getChildByName("clickableContainer");
		var clickableContainer = Scene.container.getChildByName(CLICKABLE_CONTAINER_NAME);
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
		var self = this;
		var results = this.clickable.onclick;
		var promise = $.when(1);
		results.forEach(function (element) {
			promise = promise.then(function() {
				return self.playClickableClickResult(element);
			});
		})
	}
	
	this.playClickableClickResult = function(event) {
		var deferred = $.Deferred();
		if (event != null) {
			if (event.type == "CUTSCENE") {
				CutsceneHandler.initCutscene(CutsceneHandler.findCutscene(event.id)).then(function() {
					//turnOnSwitch(event);
					deferred.resolve('complete');
				});
			}
			else if (event.type == "GAINED_ITEM") {
				var item = ItemHandler.items[this.clickable.id];
				PopupHandler.addItem(item).display().then(function() {
					deferred.resolve('complete');
				})
					//AudioManager.play(clickEvent.events[clickEvent.index].audio);
			}
			else if (event.type == "SCENE_CHANGE") {
					//goToNewScene(clickEvent.events[clickEvent.index].id);
				deferred.resolve('complete');
			}
		}
		else {
			document.onkeypress = null;
			deferred.resolve('complete');
		}
		return deferred.promise();
	}
	
	//this.clickable = function() {
		
	//}
	
	return this;
}