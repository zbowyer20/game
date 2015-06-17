function MenuScreen(dimensions) {
	this.state = {"opening": false, "closing": false};
	this.container = new createjs.Container();
	
	// maintain scope
	var self = this;
	
	/*
	 * open this menu
	 */
	this.open = function() {
		self.state.closing = false;
		self.state.opening = true;
		veil.open();
	}
	
	/*
	 * close this menu
	 */
	this.close = function() {
		self.state.opening = false;
		self.state.closing = true;
		veil.close();
	}
	
	/*
	 * animate the menu opening
	 * @param distanceToMove int The additional height to add to the menu container for this animation cycle
	 */
	function openMenu(distanceToMove) {
		if (self.container.y < MENU_HEIGHT) {
			var newY = distanceToMove + self.container.y;
			// check that the new movement won't push the opened menu away from the menu bar
			// if it does, reset the y position to the bottom of the menu bar 
			// no gaps between menu bar and menu
			if (newY >= MENU_HEIGHT) {
				self.container.y = MENU_HEIGHT;
			}
			else {
				self.container.y = newY;
			}
		}
		// finished animation
		else {
			self.state.opening = false;
		}
	}
	
	/*
	 * animate the menu closing
	 * @param distanceToMove int The height to take from the menu container for this animation cycle
	 * TODO surely this can be combined with openMenu...?
	 */
	function closeMenu(distanceToMove) {
		if (self.container.y > (0 - dimensions.height - MENU_HEIGHT)) {
			self.container.y -= distanceToMove;
			stage.update();
		}
		else {
			self.container.y = 0 - dimensions.height - MENU_HEIGHT;
			self.state.closing = false;
		}
	}
	
	/*
	 * Tick tick ticker
	 * Check if the menu needs to be animated open or closed
	 * TODO transparency of veil
	 */
	function animateMenu(event) {
		if (!event.paused) {
			var distanceToMove = (event.delta / 1000) * MENU_ANIMATION_PIXELS_PER_SECOND;
			if (self.state.opening) {
				openMenu(distanceToMove);
			}
			else if (self.state.closing) {
				closeMenu(distanceToMove);
			}
		}
	}
	
	createjs.Ticker.addEventListener("tick", animateMenu);
}