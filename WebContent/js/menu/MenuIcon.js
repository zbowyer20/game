function MenuIcon(name, iconDimensions) {
	var menu;
	var state = {"open": false};

	var container = new createjs.Container();
	
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
		menu.update();
		menu.prototype.open();
		veil.container.addEventListener("click", closeMenu);
	}
	
	function closeMenu() {
		state.open = false;
		menu.prototype.close();
	}
	
	shape.graphics.beginFill(BLACK).drawRect(0, 0, iconDimensions.width, iconDimensions.height);
	
	if (name === MENU_INVENTORY) {
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
	
	if (name === MENU_FILE) {
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				stage.addChild(new MenuFile(menuDimensions));
				stage.update();
			}
		});
	}
	
	if (name === MENU_SAVE) {
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				stage.update();
			}
		});
	}
	
	var border = drawBorderedRectangle(0, 0, iconDimensions.width, iconDimensions.height, "#FFFFFF");
	
	var text = createText(name, WHITE, 0, 50, 200);
	
	var b = text.getBounds();
	text.x = (0.5 * iconDimensions.width) - (0.5 * b.width);
	text.y = (0.5 * iconDimensions.height) + (0.25 * b.height);
	
	container.addChild(shape);
	container.addChild(border);
	container.addChild(text);
	
	return container;
}