function MenuScreen(dimensions) {
	this.opening = false;
	this.closing = false;
	this.container = new createjs.Container();
	
	var self = this;
	
	this.open = function() {
		self.closing = false;
		self.opening = true;
	}
	
	this.close = function() {
		self.opening = false;
		self.closing = true;
	}
	
	createjs.Ticker.addEventListener("tick", openMenu);
	
	function openMenu(event) {
		if (!event.paused) {
			if (self.opening) {
				if (self.container.y < MENU_HEIGHT) {
					var newY = (event.delta / 1000) * 500 + self.container.y;
					if (newY >= MENU_HEIGHT) {
						self.container.y = MENU_HEIGHT;
					}
					else {
						self.container.y = newY;
					}
				}
				else {
					self.opening = false;
				}
				stage.update();
			}
			if (self.closing) {
				if (self.container.y > (0 - dimensions.height - MENU_HEIGHT)) {
					self.container.y -= (event.delta / 1000) * 500;
					stage.update();
				}
				else {
					self.container.y = 0 - dimensions.height - MENU_HEIGHT;
					self.closing = false;
				}
				stage.update();
			}
		}
	}
}