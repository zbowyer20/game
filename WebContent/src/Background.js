function Background(background) {
	this.background;
	this.movements = {};
	
	var self = this;

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
		self.movements[movement.direction] = movement.destination;
	}
	
	this.setMovements = function(movements) {
		for (var i = 0; i < movements.length; i++) {
			self.setMovement(movements[i]);
		}
	}
	
	this.setBackground(background);
	
	return this;
}