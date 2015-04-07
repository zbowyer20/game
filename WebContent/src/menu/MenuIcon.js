function MenuIcon(name, width, height) {
	var shape = new createjs.Shape();

	var open = false;
	var menu;
	
	var dimensions = [];
	dimensions.width = width;
	dimensions.height = stage.canvas.height / 2;
		
	if (name === MENU_INVENTORY) {
		shape.graphics.beginFill("green").drawRect(0, 0, width, height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				if (!open) {
					menu = new MenuInventory(dimensions);
					stage.addChild(menu);
					open = true;
				}
				else {
					stage.removeChild(menu);
					menu = null;
					open = false;
				}
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