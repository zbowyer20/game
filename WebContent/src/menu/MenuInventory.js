function MenuInventory(dimensions) {
	var container;
	var itemWidth = dimensions.width / MAX_INVENTORY_SIZE;
	var itemHeight = window.innerHeight / 8;
	
	container = new createjs.Container();
	
	createInventoryBackground = function() {
		var graphics = new createjs.Graphics().beginFill("white").drawRect(0, 0, dimensions.width, dimensions.height);
		var background = new createjs.Shape(graphics);
		background.x = 0;
		background.y = 0;
		
		container.addChild(background);
	}
		
	createInventoryItemContainers = function() {
		var currentWidth = 0;
		var currentHeight = 0;
		var inventory = player.getInventory();

		for (var i = 0; i < MAX_INVENTORY_SIZE; i++) {
			container.addChild(drawBorderedRectangle(currentWidth, currentHeight, itemWidth, itemHeight, "#000"));
			if (i < inventory.length) {
				var item = inventory[i];
				
				var itemBitmap = convertImageToScaledBitmap(item.inventoryImage, currentWidth, currentHeight, itemWidth, itemHeight);
				
				container.addChild(itemBitmap);
			}
			
			currentWidth += itemWidth;
		}
	}
	
	createBackArrow = function() {
		var backArrow = drawArrow("red", DIRECTION_LEFT);

		backArrow.addEventListener("click", function(evt) {
			container.removeAllChildren();
			stage.update();
		});
		
		container.addChild(backArrow);
	}
	
	createInventoryBackground();
	createInventoryItemContainers();
	createBackArrow();
	
	return container;
}