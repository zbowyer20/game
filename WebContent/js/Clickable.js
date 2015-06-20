function Clickable(json) {
	this.clickable = json;
	this.addToStage = true;
	this.bitmap;
	
	this.init = function() {
		var self = this;
		this.bitmap = this.createClickableImage(this.clickable.type);
		this.setHitArea();
		this.bitmap.addEventListener("click", function() {
			if (checkPriority(ITEM_PRIORITY)) {
				if (!self.clickable.persist) {
					self.setAddToStage(false);
					self.removeFromStage();
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
	
	/*
	 * Create a clickable image
	 * @returns Bitmap The bitmap of the image
	 */
	this.createClickableImage = function() {
		var image = images[this.clickable.id];
		if (!this.clickable.location) {
			this.clickable.location = {
					"x" : 0 / DPR,
					"y" : MENU_HEIGHT / DPR
			}
		}
		if (!this.clickable.dimensions) {
			this.clickable.dimensions = {
					"width" : stage.canvas.width / DPR,
					"height" : (stage.canvas.height - MENU_HEIGHT) / DPR
			}
		}
		var clickableBit = convertImageToScaledBitmap(image, ((this.clickable.location.x * DPR)), this.clickable.location.y * DPR, this.clickable.dimensions.width * DPR, this.clickable.dimensions.height * DPR);
		clickableBit.name = this.clickable.id;
		return clickableBit;
	}
	
	this.setHitArea = function() {
		if (this.clickable.hitArea) {
			var hit = new createjs.Shape();
			hit.graphics.beginFill("#000").drawRect(this.clickable.hitArea.x * DPR, this.clickable.hitArea.y * DPR, this.clickable.hitArea.width * DPR, this.clickable.hitArea.height * DPR);
			this.bitmap.hitArea = hit;
			return true;
		}
		return false;
	}
	
	this.loadClickableClickResult = function() {
		if (!this.clickable.onclick) {
			return false;
		}
		var self = this;
		var results = this.getClickResults();
		var promise = $.when(1);
		results.forEach(function (element) {
			promise = promise.then(function() {
				return self.playClickableClickResult(element);
			});
		})
	}
	
	/*
	 * Get the most relevant cutscene to play
	 * Through priority, switches, etc
	 * @param cutscenes The cutscenes in JSON
	 * @returns The cutscene that should be played
	 */
	this.getClickResults = function() {
		if (this.clickable.onclick == null) {
			return null;
		}
		var results = [];
		for (var i = 0; i < this.clickable.onclick.length; i++) {
			results = this.mostRelevantOf(results, this.clickable.onclick[i]);
		}
		return results;
	}
	
	this.mostRelevantOf = function(current, compare) {
		if (current.length == 0 || (compare.priority >= current[0].priority)) {
			if (GameUtils.validToPlay(compare)) {
				if (current.length > 0 && compare.priority == current[0].priority) {
					current.push(compare);
				}
				else {
					var result = [];
					result.push(compare);
					return result;
				}
			}
		}
		return current;
	},
	
	this.playClickableClickResult = function(event) {
		var deferred = $.Deferred();
		if (event != null) {
			GameUtils.setSwitch(event.switchOn, true);
			if (event.type == "AUDIO") {
				AudioManager.play(event.audio);
				deferred.resolve('complete');
			}
			else if (event.type == "CUTSCENE") {
				CutsceneHandler.initCutscene(CutsceneHandler.findCutscene(event.id)).then(function() {
					deferred.resolve('complete');
				});
			}
			else if (event.type == "GAINED_ITEM") {
				var item = ItemHandler.items[this.clickable.id];
				player.addItem(item);
				ItemContainer.update(player.getHeldItem());
				PopupHandler.addItem(item).display().then(function() {
					deferred.resolve('complete');
				})
				AudioManager.play(event.audio);
			}
			else if (event.type == "GAINED_FILE") {
				var file = FileHandler.files[this.clickable.id];
				player.addFile(file);
				PopupHandler.addFile(file).display().then(function() {
					deferred.resolve('complete');
				})
				AudioManager.play(event.audio);
			}
			else if (event.type == "MOVE") {
				Scene.turn(Scene.components.areas[event.destination], false);
				stage.update();
				deferred.resolve('complete');
			}
			else if (event.type == "SCENE_CHANGE") {
				Scene.nextScene(event.id);
				stage.update();
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