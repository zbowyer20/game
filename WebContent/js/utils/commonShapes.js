function convertImageToBitmap(image, x, y) {
	var bitmap = new createjs.Bitmap(image);
	bitmap.x = x;
	bitmap.y = y;
	return bitmap;
}

function convertVideoToBitmap(vid, x, y) {
	var video = document.createElement('video'); 
	video.src = vid.src; 
	video.autoplay = true; 
	if (vid.loop) {
		video.setAttribute("loop", false);
	}

	var b = new createjs.Bitmap(video); 
	b.x = x; 
	b.y = y;
	
	return b;
}

function convertVideoToScaledBitmap(video, x, y, width, height) {
	var bitmap = convertVideoToBitmap(video, x, y);
	bitmap.scaleX = width / VIDEO_WIDTH;
	bitmap.scaleY = height / VIDEO_HEIGHT;
	return bitmap;
}

function convertImageToScaledBitmap(image, x, y, width, height) {
	var bitmap = convertImageToBitmap(image, x, y);
	bitmap.scaleX = width / image.width;
	bitmap.scaleY = height / image.height;
	return bitmap;
}

function drawArrow(colour, stroke, direction, persist) {
	var arrow = new createjs.Shape();
	var position = {"x": 0, "y": 0, "angle": 0};
	
	switch (direction) {
		case DIRECTION_LEFT:
			position.x = 40 * DPR;
			position.y = stage.canvas.height / 2;
			position.angle = 180;
			console.log(position); 
			break;
		case DIRECTION_RIGHT:
			position.x = stage.canvas.width - (40 * DPR);
			position.y = stage.canvas.height / 2;
			position.angle = 0;
			break;
		case DIRECTION_BACK:
			position.x = (stage.canvas.width / 2) - (15 * DPR);
			position.y = stage.canvas.height - (40 * DPR);
			position.angle = 90;
		case DIRECTION_MENU_BACK:
			position.x = 30 * DPR;
			position.y = 25 * DPR;
			position.angle = 180;
	}
	
	arrow.graphics.setStrokeStyle(1).beginStroke(stroke).beginFill(colour).drawPolyStar(position.x, position.y , 25 * DPR, 3, 0.5, position.angle);
	
	
	//if (direction.hover) {
	arrow.alpha = 1;
	
	if (!persist) {
		setTimeout(function() {
			arrow.alpha = 0;
			stage.update();
			hoverArea.addEventListener("mouseout", function(event) {
				arrow.alpha = 0;
				stage.update();
			})
		}, NAVIGATION_INITIAL_SHOWTIME);
		
		var hoverArea = new createjs.Shape();
		var hoverAreaHitArea = new createjs.Shape();
		hoverAreaHitArea.graphics.beginFill("#000").drawRect(position.x - 100, position.y - 100, 100 * DPR, 100 * DPR);
		hoverArea.hitArea = hoverAreaHitArea;
				
		hoverArea.addEventListener("mouseover", function(event) {
			if (checkPriority(NAVIGATION_PRIORITY)) {
				arrow.alpha = 1;
				stage.update();
			}
		})
	}

//}
	
	var container = new createjs.Container();
	container.addChild(arrow);
	container.addChild(hoverArea);
	
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

function drawBorderedRectangle(x, y, width, height, colours) {
	var shape = new createjs.Shape();
	shape.graphics.beginStroke(colours.stroke || "#FFFFFF");
	shape.graphics.setStrokeStyle(1);
	shape.snapToPixel = true;
	shape.graphics.beginFill(colours.background || "rgba(0, 0, 0, 0.5)").drawRect(0, 0, width, height);
	shape.x = x;
	shape.y = y;
	
	return shape;
}