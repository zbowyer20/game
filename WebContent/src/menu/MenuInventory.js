function MenuInventory(dimensions) {
	var VIEWING_ITEM_NAME = "viewingItem";
	
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
				
				itemBitmap.addEventListener("click", updateInventoryMainItemDelegate(item));
				
				container.addChild(itemBitmap);
			}
			
			currentWidth += itemWidth;
		}
	}
	
	createInventoryMainItem = function(mainItemContainer) {
		
		var mainItemWidth = stage.canvas.width / 3;
		
		var currentItem = player.getHeldItem();
		var itemViewing = convertImageToScaledBitmap(currentItem.inventoryImage, mainItemWidth, itemHeight + 20, mainItemWidth, stage.canvas.height / 3);
		mainItemContainer.addChild(itemViewing);
		
		var itemDescriptionTxt = createText(currentItem.description, "#000000", mainItemWidth, itemHeight + (stage.canvas.height/3) + 50, mainItemWidth);
			
		mainItemContainer.addChild(itemDescriptionTxt);
			
	}
	
	/*
	* Closure stuff... I guess
	*/
	function updateInventoryMainItemDelegate(item) {
		return function() {
			updateInventoryMainItem(item);
		}
	}
	
	updateInventoryMainItem = function(item) {
		console.log('reached');
		player.setHeldItem(item);
		
		var mainItemContainer = container.getChildByName(VIEWING_ITEM_NAME);
		mainItemContainer.removeAllChildren();
		createInventoryMainItem(mainItemContainer);
	}
	
	createBackArrow = function() {
		var backArrow = drawArrow("red", DIRECTION_LEFT);

		backArrow.addEventListener("click", function(evt) {
			container.removeAllChildren();
			updateItemContainer();
			stage.update();
		});
		
		container.addChild(backArrow);
	}
	
	createInventoryBackground();
	createInventoryItemContainers();
	
	var mainItemContainer = new createjs.Container();
	mainItemContainer.name = VIEWING_ITEM_NAME;
	container.addChild(mainItemContainer);
	
	createInventoryMainItem(mainItemContainer);
	createBackArrow();
	
	return container;
}