function Area(area) {
	this.background = {};
	this.movements = {};
	this.clickables = {};
	
	var self = this;

	this.initBackground = function(area) {
		if (videos[area.id]) {
			self.background = convertVideoToScaledBitmap(videos[area.id], 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
		}
		else if (images[area.id]) {
			self.background = convertImageToScaledBitmap(images[area.id], 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
		}
		self.background.name = area.name;
		self.background.clickables = area.clickables;
		self.background.defaultBackground = area.defaultBackground;
	}
	
	this.getBackground = function() {
		return self.background;
	}

	this.setBackground = function(background) {
		self.background = background;
	}
	
	this.getDestinationByDirection = function(direction) {
		return self.movements[direction];
	}
	
	this.getMovements = function() {
		return self.movements;
	}

	this.setMovement = function(movement) {
		self.movements[movement.name] = movement.destination;
	}
	
	this.setMovements = function(movements) {
		if (!movements) {
			return false;
		}
		for (var i = 0; i < movements.length; i++) {
			self.setMovement(movements[i]);
		}
	}
	
	this.setClickables = function(clickables) {
		if (!clickables) {
			return false;
		}
		for (var i = 0; i < clickables.length; i++) {
			this.clickables[clickables[i].id] = new Clickable(clickables[i]).init();
		}
	}
	
	this.getClickables = function(visibleOnly) {
		if (!visibleOnly) {
			return this.clickables;
		}
		else {
			var clickables = {};
			for (var id in this.clickables) {
				if (this.clickables[id].shouldAddToStage()) {
					clickables[id] = this.clickables[id];
				}
			}
			return clickables;
		}
	}
		
	this.initBackground(area);
	this.setMovements(area.movements);
	this.setClickables(area.clickables);

	return this;
}