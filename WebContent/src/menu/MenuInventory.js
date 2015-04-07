function MenuInventory(dimensions) {
	var VIEWING_ITEM_NAME = "viewingItem";
	
	var container;
	var itemWidth = dimensions.width / MAX_INVENTORY_SIZE;
	var itemHeight = dimensions.height / 8;
	
	container = new createjs.Container();
	container.y = MENU_HEIGHT;
	
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
				
				var hitArea = new createjs.Shape();
				hitArea.graphics.beginFill("#000").drawRect(0,0,itemWidth,itemHeight);
				hitArea.x = currentWidth;
				hitArea.y = currentHeight;
				itemBitmap.hitArea = hitArea;
				
				var itemContainer = new createjs.Container();
				itemContainer.addChild(itemBitmap);
				
				itemContainer.hitArea = hitArea;
				
				itemContainer.addEventListener("click", updateInventoryMainItemDelegate(item));
				
				container.addChild(itemContainer);
			}
			
			currentWidth += itemWidth;
		}
	}
	
	createInventoryMainItem = function(mainItemContainer) {
		
		var mainItemWidth = dimensions.width / 3;
		
		var currentItem = player.getHeldItem();
		var itemViewing = convertImageToScaledBitmap(currentItem.inventoryImage, mainItemWidth, itemHeight + 20, mainItemWidth, dimensions.height / 3);
		mainItemContainer.addChild(itemViewing);
		
		var itemDescriptionTxt = createText(currentItem.description, "#000000", mainItemWidth, itemHeight + (dimensions.height/3) + 50, mainItemWidth);
			
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