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
			
			this.update();
			
			this.container.addEventListener("click", function() {
				self.update();
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
		
		clear: function() {
			this.container.removeChildAt(1);
		},
		
		update: function() {
			var item = player.getHeldItem();
			
			if (item) {
				this.clear();
				var image = convertImageToScaledBitmap(item.inventoryImage, 15 * DPR, stage.canvas.height - (75 * DPR), ITEM_CONTAINER_ITEM_WIDTH, ITEM_CONTAINER_ITEM_HEIGHT);
				this.container.addChild(image);
				
				stage.update();
			}
		}
}