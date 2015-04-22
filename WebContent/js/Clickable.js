function Clickable(json) {
	this.clickable = json;
	this.addToStage = true;
	this.bitmap;
	
	this.init = function() {
		var self = this;
		this.bitmap = this.createClickableImage(this.clickable.type);
		this.bitmap.addEventListener("click", function() {
			if (checkPriority(ITEM_PRIORITY)) {
				if (!self.clickable.persist) {
					self.setAddToStage(false);
					self.removeFromStage();
				}
				if (self.clickable.type == CLICKABLE_ITEM) {
					self.addToInventory();
				}
				self.loadClickableClickResult();
			}
		});
		return this;
	}
	
	this.removeFromStage = function() {
		this.setAddToStage(false);
		Scene.removeClickableFromContainer(this.bitmap.name);
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
	 * @returns Bitmap The bitmap of the image
	 */
	this.createClickableImage = function() {
		var image = images[this.clickable.id];
		
		var clickableBit = convertImageToScaledBitmap(image, ((this.clickable.location.x * DPR)), this.clickable.location.y * DPR, this.clickable.dimensions.width * DPR, this.clickable.dimensions.height * DPR);
		clickableBit.name = this.clickable.id;
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
				player.addItem(item);
				ItemContainer.update();
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
	
	this.shouldAddToStage = function() {
		return this.addToStage;
	}
	
	this.setAddToStage = function(addToStage) {
		this.addToStage = addToStage;
	}
	
	this.getPrimaryPosition = function() {
		return {"x": this.clickable.location.x * DPR, "y": this.clickable.location.y * DPR};
	}

	return this;
}