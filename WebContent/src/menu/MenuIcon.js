function MenuIcon(name, width, height) {
	var shape = new createjs.Shape();
	
	var open = false;
	var menu;
	
	var dimensions = [];
	dimensions.width = width;
	dimensions.height = stage.canvas.height / 2;
	
	function clickMenuIcon() {
		if (!open) {
			openMenu();
		}
		else {
			closeMenu();
		}
	}
	
	function openMenu() {
		layers.menuLayer.addChild(menu.prototype.container);
		veil.state.opening = true;
		veil.container.addEventListener("click", closeMenu);
		menu.prototype.open();
		open = true;
		stage.update();
	}
	
	function closeMenu() {
		open = false;
		veil.state.closing = true;
		menu.prototype.close();
		stage.update();
	}
	
	if (name === MENU_INVENTORY) {
		shape.graphics.beginFill("green").drawRect(0, 0, width, height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				if (menu == null) {
					menu = new MenuInventory(dimensions);
				}
				clickMenuIcon();
				stage.update();
			}
		});
	}
	
	if (name === MENU_PARTY) {
		shape.graphics.beginFill("red").drawRect(0, 0, width, height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				stage.addChild(new MenuParty(dimensions));
				stage.update();
			}
		});
	}
	
	if (name === MENU_SAVE) {
		shape.graphics.beginFill("blue").drawRect(0, 0, width, height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				stage.update();
			}
		});
	}
	
	return shape;
}