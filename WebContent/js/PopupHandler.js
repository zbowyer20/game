var PopupHandler = {
		container: {},
		dimensions: {},
		position: {},
		background: {},
		
		init: function() {
			this.container = new createjs.Container();
			this.dimensions = {"w": stage.canvas.width * (1/3), "h": stage.canvas.height * (5/8)};
			this.position = {"x": stage.canvas.width * (1/3), "y": MENU_HEIGHT * 2};
			this.background = drawBorderedRectangle(this.position.x, this.position.y, this.dimensions.w, this.dimensions.h, WHITE);
			return this;
		},
		
		clear: function() {
			this.container.removeAllChildren();
			this.container.addChild(this.background);
			return this;
		},
		
		addItem: function(item) {
			this.clear(); 
			var image = convertImageToScaledBitmap(item.inventoryImage, this.position.x + (30*DPR), this.position.y + (10*DPR), this.dimensions.w - (60*DPR), this.dimensions.h / 2);
			var name = this.createNameText("Gained " + item.name + "!", WHITE, this.position.x + (30 * DPR), this.position.y + (40*DPR) + (this.dimensions.h/2), this.dimensions.w - (60 * DPR));
			var description = createText(item.description, WHITE, this.position.x + (30 * DPR), this.position.y + (50*DPR) + (this.dimensions.h/2) + name.getBounds().height, this.dimensions.w - (60 * DPR));
		
			this.container.addChild(image);
			this.container.addChild(name);
			this.container.addChild(description);
			return this;
		},
		
		createNameText: function(text, colour, x, y, h, w) {
			var name = createText(text, colour, x, y, h, w);
			var b = name.getBounds();
			name.x = this.position.x + (0.5 * this.dimensions.w) - (0.5 * b.width);
			return name;
		},
				
		display: function() {
			this.deferred = $.Deferred();
			priority = ITEM_GAINED_PRIORITY;
			Scene.containers.dialogLayer.addChild(this.container);
			stage.update();
			this.keyPress();
			return this.deferred.promise();
		},
		
		keyPress: function() {
			var self = this;
			document.onkeypress = function() {
				Scene.containers.dialogLayer.removeChild(self.container);
				stage.update();
				priority = LOWEST_PRIORITY;
				self.deferred.resolve("complete");
			}
		}

}