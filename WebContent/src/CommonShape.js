//function drawArrow(colour, x, y, radius, angle) {
//	var arrow = new createjs.Shape();
//	arrow.graphics.beginFill(colour).drawPolyStar(x, y , radius, 3, 0.5, angle);
//	
//	var container = new createjs.Container();
//	container.addChild(arrow);
//	
//	return container;
//}

function drawArrow(colour, direction) {
	var arrow = new createjs.Shape();
	var x = y = angle = 0;
	
	switch (direction) {
		case DIRECTION_LEFT:
			x = 40;
			y = stage.canvas.height / 2;
			angle = 180;
			break;
		case DIRECTION_RIGHT:
			x = stage.canvas.width - 40;
			y = stage.canvas.height / 2;
			angle = 0;
			break;
	}
	
	arrow.graphics.beginFill(colour).drawPolyStar(x, y , 30, 3, 0.5, angle);
	
	var container = new createjs.Container();
	container.addChild(arrow);
	
	return container;
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