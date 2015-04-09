function MenuIcon(name, iconDimensions) {
	var menu;
	var state = {"open": false};

	var shape = new createjs.Shape();	
	var menuDimensions = {"width": iconDimensions.width, "height": stage.canvas.height / 2};
	
	function clickMenuIcon() {
		if (!state.open) {
			openMenu();
		}
		else {
			closeMenu();
		}
	}
	
	function openMenu() {
		state.open = true;
		layers.menuLayer.addChild(menu.prototype.container);
		menu.prototype.open();
		veil.container.addEventListener("click", closeMenu);
	}
	
	function closeMenu() {
		state.open = false;
		menu.prototype.close();
	}
	
	if (name === MENU_INVENTORY) {
		shape.graphics.beginFill("green").drawRect(0, 0, iconDimensions.width, iconDimensions.height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				if (menu == null) {
					menu = new MenuInventory(menuDimensions);
				}
				clickMenuIcon();
				stage.update();
			}
		});
	}
	
	if (name === MENU_PARTY) {
		shape.graphics.beginFill("red").drawRect(0, 0, iconDimensions.width, iconDimensions.height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				stage.addChild(new MenuParty(menuDimensions));
				stage.update();
			}
		});
	}
	
	if (name === MENU_SAVE) {
		shape.graphics.beginFill("blue").drawRect(0, 0, iconDimensions.width, iconDimensions.height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				stage.update();
			}
		});
	}
	
	return shape;
}