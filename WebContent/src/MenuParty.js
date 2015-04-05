function MenuParty() {
	var graphics = new createjs.Graphics().beginFill("white").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	var background = new createjs.Shape(graphics);
	background.x = 0;
	background.y = 0;
	
	var container = new createjs.Container();
	container.addChild(background);
	
	var currentWidth = 0;
	var currentHeight = 0;
	
	var PARTY_SIZE = 4;
	
	var border = new createjs.Shape();
	border.graphics.beginStroke("#000");
	border.graphics.setStrokeStyle(1);
	border.snapToPixel = true;
	border.graphics.drawRect(0, 0, stage.canvas.width / PARTY_SIZE, stage.canvas.height);
	border.x = currentWidth;
	border.y = currentHeight;
	
	currentWidth += stage.canvas.width / 4;
	container.addChild(border);
		
	var itemWidth = (stage.canvas.width - (stage.canvas.width / PARTY_SIZE)) / (PARTY_SIZE - 1);
	var itemHeight = stage.canvas.height;
	
	for (var i = 0; i < PARTY_SIZE - 1; i++) {
		container.addChild(drawBorderedRectangle(currentWidth, currentHeight, itemWidth, itemHeight, "#000"));
		currentWidth += itemWidth;
	}
	
	var backArrow = drawArrow("blue", 40, stage.canvas.height/2, 30, 180);

	backArrow.addEventListener("click", function(evt) {
		container.removeAllChildren();
		stage.update();
	});
	
	container.addChild(backArrow);
	
	return container;
}