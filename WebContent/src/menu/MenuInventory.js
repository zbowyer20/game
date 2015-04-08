function MenuInventory(dimensions) {
	var opening = false;
	var closing = false;
	
	var VIEWING_ITEM_NAME = "viewingItem";
	
	var container;
	var itemWidth = dimensions.width / MAX_INVENTORY_SIZE;
	var itemHeight = dimensions.height / 8;
	
	container = new createjs.Container();
	container.y = 0 - dimensions.height;
	
	createInventoryBackground = function() {
		var graphics = new createjs.Graphics().beginFill("white").drawRect(0, 0, dimensions.width, dimensions.height);
		var background = new createjs.Shape(graphics);
		background.x = 0;
		background.y = 0;
				
		opening = true;
		
		stage.update();
		
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
	
	createInventoryBackground();
	createInventoryItemContainers();
	
	var mainItemContainer = new createjs.Container();
	mainItemContainer.name = VIEWING_ITEM_NAME;
	container.addChild(mainItemContainer);
		
	createjs.Ticker.addEventListener("tick", openMenu);
	
	createInventoryMainItem(mainItemContainer);
	
	function openMenu(event) {
		if (!event.paused) {
			if (opening) {
				if (container.y < 0) {
					container.y+= (event.delta / 1000) * 500;
				}
				else {
					container.y = 0;
					opening = false;
				}
				stage.update();
			}
			if (closing) {
				if (container.y > (0 - dimensions.height)) {
					container.y -= (event.delta / 1000) * 500;
					stage.update();
				}
				else {
					container.y = 0 - dimensions.height;
					closing = false;
				}
				stage.update();
			}
		}
	}
	
	return container;
}