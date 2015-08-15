var ItemContainer = {
		container : {},
		
		init: function() {
			var border = drawBorderedRectangle(10 * DPR, stage.canvas.height - (80 * DPR), ITEM_CONTAINER_WIDTH, ITEM_CONTAINER_HEIGHT, WHITE);
			this.container = new createjs.Container();
			
			this.container.addChild(border);
			
			// without a hit area, the user clicking a transparent part of the image
			// won't work
			this.container.hitArea = this.createHitArea();
			
			var self = this;
			
			this.update(player.getHeldItem());
			
			this.container.addEventListener("click", function() {
				self.onclick();
			});
						
			return this;
		},
		
		createHitArea: function() {
			var hit = new createjs.Shape();
			hit.graphics.beginFill(BLACK).drawRect(0,0,ITEM_CONTAINER_WIDTH,ITEM_CONTAINER_HEIGHT);
			hit.x = 20;
			hit.y = stage.canvas.height - (80 * DPR);
			return hit;
		},
		
		hide: function() {
			this.container.visible = false;
		},
		
		show: function() {
			this.container.visible = true;
		},
		
		clear: function() {
			this.container.removeChildAt(1);
		},
		
		update: function(item) {			
			if (item) {
				this.clear();
				var image = convertImageToScaledBitmap(item.inventoryImage, 15 * DPR, stage.canvas.height - (75 * DPR), ITEM_CONTAINER_ITEM_WIDTH, ITEM_CONTAINER_ITEM_HEIGHT);
				this.container.addChild(image);
				
				stage.update();
			}
		},
		
		onclick: function() {
			if (checkPriority(MENU_PRIORITY) && (player.getHeldItem() != null)) {
				var nextItem = this.getNextItem();
				if (nextItem) {
					player.setHeldItem(nextItem);
					this.update(nextItem);
				}
			}
		},
		
		getNextItem: function() {
			var current = player.getHeldItem();
			var i = 0;
			var result = null;
			var inventory = player.getInventory();
			while ((i < inventory.length) && (!result)) {
				if (inventory[i].id == current.id) {
					if ((i-1) >= 0) {
						result = inventory[i-1];
					}
					else {
						result = inventory[inventory.length - 1];
					}
				}
				else {
					i++;
				}
			}
			return result;
		}
}