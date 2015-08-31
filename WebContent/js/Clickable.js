function Clickable(json) {
	this.clickable = json;
	this.addToStage = true;
	this.bitmap;
	this.layer;
	
	this.init = function() {
		var self = this;
		this.bitmap = this.createClickableImage(this.clickable.type);
		if (this.clickable.content) {
			this.text = this.createClickableText();
			if (this.clickable.content.type == "PUZZLE-STATE") {
				var self = this;
				$(document).bind(self.clickable.content.puzzleID + "_" + self.clickable.content.componentID, function() {
					self.text.text = PuzzleHandler.getPuzzle(self.clickable.content.puzzleID).getStateValue(self.clickable.content.componentID);
				})
			}
		}
		this.setHitArea();
		this.layer = this.clickable.layer || 0;
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
	
	this.createClickableText = function() {
		var text = createText(this.clickable.content.text || PuzzleHandler.getPuzzle(this.clickable.content.puzzleID).getStateValue(this.clickable.content.componentID), BLACK, this.clickable.content.x * DPR, this.clickable.content.y * DPR, 200);
		return text;
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
	
	this.loadClickableClickResult = function(ev) {
		var events = ev ? ev : this.clickable.onclick;
		if (!events) {
			return false;
		}
		var self = this;
		var results = this.getClickResults(events);
		var i = 0;
		var deferred = $.Deferred();
		console.log(results);
		self.playResult(results, 0, deferred);
		return deferred.promise();
	}
	
	this.playResult = function(events, i, deferred) {
		if (i < events.length) {
			var self = this;
			this.playClickableClickResult(events[i]).then(function(e) {
				self.playResult(events, i+1, deferred);
			});
		}
		else {
			deferred.resolve('complete');
			return true;
		}
	}
	
	/*
	 * Get the most relevant cutscene to play
	 * Through priority, switches, etc
	 * @param cutscenes The cutscenes in JSON
	 * @returns The cutscene that should be played
	 */
	this.getClickResults = function(ev) {
		var events = ev ? ev : this.clickable.onclick;
		return EventManager.getRelevantEvents(events);
	}
	
	this.playClickableClickResult = function(event) {
		var deferred = $.Deferred();
		if (event != null) {
			EventManager.playEvent(event, deferred);
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