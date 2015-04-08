function MenuInventory(dimensions) {
	
	/*
	 * Set the width and height of each clickable item
	 * @returns Object{width:int, height:int} The dimensions of each clickable item
	 */
	setItemDimensions = function() {
		var itemDimensions = {};
		itemDimensions.width = dimensions.width / MAX_INVENTORY_SIZE;
		itemDimensions.height = Math.max(dimensions.height / 8, 30);
		
		return itemDimensions;
	}
	
	/*
	 * Creates the background for the whole inventory
	 */
	createInventoryBackground = function() {
		var graphics = new createjs.Graphics().beginFill(WHITE).drawRect(0, 0, dimensions.width, dimensions.height);
		var background = new createjs.Shape(graphics);
		background.x = 0;
		background.y = 0;
				
		self.prototype.container.addChild(background);
		
		stage.update();	
	}
	
	/*
	 * Fetches the item information to be stored in an item container
	 * @param item The item itself
	 * @param position{x: int, y: int} The x and y position of the item
	 * @param itemDimensions{width: int, height: int} The height and width of the item to be displayed
	 * @returns The container including that item
	 */
	createInventoryItemContainer = function(item, position, itemDimensions) {
		var itemBitmap = convertImageToScaledBitmap(item.inventoryImage, position.x, position.y, itemDimensions.width, itemDimensions.height);
		
		var hitArea = new createjs.Shape();
		hitArea.graphics.beginFill(BLACK).drawRect(0,0,itemDimensions.width,itemDimensions.height);
		hitArea.x = position.x;
		hitArea.y = position.y;
		itemBitmap.hitArea = hitArea;
		
		var itemContainer = new createjs.Container();
		itemContainer.addChild(itemBitmap);
		itemContainer.hitArea = hitArea;
		
		itemContainer.addEventListener("click", updateInventoryMainItemDelegate(item));
		
		return itemContainer;
	}
	
	/*
	 * Creates the smaller item containers
	 */
	createInventoryItemContainers = function() {
		// the current position for an item container
		var current = {"x": 0, "y": 0};
		var inventory = player.getInventory();
		
		// for each possible item in the inventory, add in a item slot with an item, if necessary
		for (var i = 0; i < MAX_INVENTORY_SIZE; i++) {
			self.prototype.container.addChild(drawBorderedRectangle(current.x, current.y, itemDimensions.width, itemDimensions.height, BLACK));
			if (i < inventory.length) {
				var item = inventory[i];
				self.prototype.container.addChild(createInventoryItemContainer(item, current, itemDimensions));
			}
			current.x += itemDimensions.width;
		}
	}
	
	createInventoryMainItem = function(mainItemContainer) {
		var mainItemDimensions = {"width" : dimensions.width / INVENTORY_MAIN_ITEM_RECIPROCAL_WIDTH, "height" : dimensions.height / INVENTORY_MAIN_ITEM_RECIPROCAL_HEIGHT};
		
		var currentItem = player.getHeldItem();
		var itemViewing = convertImageToScaledBitmap(currentItem.inventoryImage, mainItemDimensions.width, itemDimensions.height + 20, mainItemDimensions.width, mainItemDimensions.height);
		mainItemContainer.addChild(itemViewing);
		
		var itemDescriptionTxt = createText(currentItem.description, BLACK, mainItemDimensions.width, itemDimensions.height + mainItemDimensions.height + 50, mainItemDimensions.width);
			
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
	
	/*
	 * Update the main item, held by the player
	 * @param item Item the item that will be held
	 */
	updateInventoryMainItem = function(item) {
		player.setHeldItem(item);
		updateItemContainer();
		
		var mainItemContainer = self.prototype.container.getChildByName(VIEWING_ITEM_NAME);
		mainItemContainer.removeAllChildren();
		createInventoryMainItem(mainItemContainer);
	}
	
	this.prototype = new MenuScreen(dimensions);
	
	// The name of the container displaying the currently held item
	var VIEWING_ITEM_NAME = "viewingItem";
	
	var itemDimensions = setItemDimensions();
	
	this.prototype.container.y = 0 - dimensions.height;
	
	//maintain scope
	var self = this
	
	createInventoryBackground();
	createInventoryItemContainers();
	
	var mainItemContainer = new createjs.Container();
	mainItemContainer.name = VIEWING_ITEM_NAME;
	self.prototype.container.addChild(mainItemContainer);
			
	createInventoryMainItem(mainItemContainer);
	
	return this;
}