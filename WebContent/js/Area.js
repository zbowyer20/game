function Area(area) {
	this.background = {};
	this.movements = {};
	
	var self = this;
	
	this.initBackground = function(area) {
		self.background = convertImageToScaledBitmap(images[area.id], 0, MENU_HEIGHT, stage.canvas.width, stage.canvas.height - MENU_HEIGHT);
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
		for (var i = 0; i < movements.length; i++) {
			self.setMovement(movements[i]);
		}
	}
	
	this.initBackground(area);
	this.setMovements(area.movements);

	return this;
}