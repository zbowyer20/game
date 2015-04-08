function MenuIcon(name, width, height) {
	var shape = new createjs.Shape();

	function createVeil() {
		var cont = new createjs.Container();
		
		var graphics = new createjs.Graphics().beginFill("#000000").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
		var shape = new createjs.Shape(graphics);
		shape.alpha = 0.4; 
		
		cont.addChild(shape);
		
		return cont;
	}
	
	var open = false;
	var menu;
	
	var dimensions = [];
	dimensions.width = width;
	dimensions.height = stage.canvas.height / 2;
		
	var veil = createVeil();
	
	if (name === MENU_INVENTORY) {
		shape.graphics.beginFill("green").drawRect(0, 0, width, height);
		shape.addEventListener("click", function() {
			if (priority <= MENU_PRIORITY) {
				if (!open) {
					menu = new MenuInventory(dimensions);
					layers.menuLayer.addChild(menu.prototype.container);
					layers.sceneLayer.addChild(veil);
					stage.update();
					open = true;
				}
				else {
					open = false;
					layers.sceneLayer.removeChild(veil);
					menu.prototype.close();
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