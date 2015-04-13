function convertImageToBitmap(image, x, y) {
	var bitmap = new createjs.Bitmap(image);
	bitmap.x = x;
	bitmap.y = y;
	return bitmap;
}

function convertImageToScaledBitmap(image, x, y, width, height) {
	var bitmap = convertImageToBitmap(image, x, y);
	bitmap.scaleX = width / image.width;
	bitmap.scaleY = height / image.height;
	return bitmap;
}

function drawArrow(colour, direction) {
	var arrow = new createjs.Shape();
	var position = {"x": 0, "y": 0, "angle": 0};
	
	switch (direction) {
		case DIRECTION_LEFT:
			position.x = 40 * DPR;
			position.y = stage.canvas.height / 2;
			position.angle = 180;
			break;
		case DIRECTION_RIGHT:
			position.x = stage.canvas.width - (40 * DPR);
			position.y = stage.canvas.height / 2;
			position.angle = 0;
			break;
	}
	
	arrow.graphics.beginFill(colour).drawPolyStar(position.x, position.y , 30 * DPR, 3, 0.5, position.angle);
	
	var container = new createjs.Container();
	container.addChild(arrow);
	
	return container;
}

function createText(content, colour, x, y, lineWidth) {
	var text = new createjs.Text(content, FONT, colour);
	text.textBaseline = "alphabetic";
	text.y = y;
	text.x = x;
	text.lineWidth = lineWidth;
	return text;
}

function drawBorderedRectangle(x, y, width, height, colour) {
	var shape = new createjs.Shape();
	shape.graphics.beginStroke(colour);
	shape.graphics.setStrokeStyle(1);
	shape.snapToPixel = true;
	shape.graphics.drawRect(0, 0, width, height);
	shape.x = x;
	shape.y = y;
	
	return shape;
}