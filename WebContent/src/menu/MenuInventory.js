function MenuInventory(dimensions) {
	this.prototype = new MenuScreen(dimensions);
	
	var VIEWING_ITEM_NAME = "viewingItem";
	
	var itemWidth = dimensions.width / MAX_INVENTORY_SIZE;
	var itemHeight = dimensions.height / 8;
	
	this.prototype.container.y = 0 - dimensions.height;
	
	//maintain scope
	var self = this
	
	createInventoryBackground = function() {
		var graphics = new createjs.Graphics().beginFill("white").drawRect(0, 0, dimensions.width, dimensions.height);
		var background = new createjs.Shape(graphics);
		background.x = 0;
		background.y = 0;
				
		self.prototype.container.addChild(background);
		
		stage.update();
		
		self.prototype.open();
		
		stage.update();
		
	}
		
	createInventoryItemContainers = function() {
		var currentWidth = 0;
		var currentHeight = 0;
		var inventory = player.getInventory();

		for (var i = 0; i < MAX_INVENTORY_SIZE; i++) {
			self.prototype.container.addChild(drawBorderedRectangle(currentWidth, currentHeight, itemWidth, itemHeight, "#000"));
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
				
				self.prototype.container.addChild(itemContainer);
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
		
		stage.update();
			
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
		
		var mainItemContainer = self.prototype.container.getChildByName(VIEWING_ITEM_NAME);
		mainItemContainer.removeAllChildren();
		createInventoryMainItem(mainItemContainer);
	}
	
	createInventoryBackground();
	createInventoryItemContainers();
	
	var mainItemContainer = new createjs.Container();
	mainItemContainer.name = VIEWING_ITEM_NAME;
	self.prototype.container.addChild(mainItemContainer);
			
	createInventoryMainItem(mainItemContainer);
	
	return this;
}