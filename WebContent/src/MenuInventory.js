function MenuInventory(dimensions) {
	var graphics = new createjs.Graphics().beginFill("white").drawRect(0, 0, dimensions.width, dimensions.height);
	var background = new createjs.Shape(graphics);
	background.x = 0;
	background.y = 0;
	
	var container = new createjs.Container();
	container.addChild(background);
	
	var itemWidth = dimensions.width / MAX_INVENTORY_SIZE;
	var itemHeight = window.innerHeight / 8;
	
	var currentWidth = 0;
	var currentHeight = 0;
	
	var inventory = player.getInventory();
	console.log(inventory);
	
	for (var i = 0; i < MAX_INVENTORY_SIZE; i++) {
		container.addChild(drawBorderedRectangle(currentWidth, currentHeight, itemWidth, itemHeight, "#000"));
		if (i < inventory.length) {
			var item = inventory[i];
			
			console.log(item);
			
			var bg = item.inventoryImage;
			var backgroundBit = new createjs.Bitmap(bg);
			backgroundBit.scaleX = itemWidth / bg.width;
			backgroundBit.scaleY = itemHeight / bg.height;
			backgroundBit.x = currentWidth;
			backgroundBit.y = currentHeight;
			
			container.addChild(backgroundBit);
		}
		
		currentWidth += itemWidth;
	}
	
	var backArrow = drawArrow("red", 40, canvas.height/2, 30, 180);

	backArrow.addEventListener("click", function(evt) {
		container.removeAllChildren();
		stage.update();
	});
	
	container.addChild(backArrow);
	
	return container;
}