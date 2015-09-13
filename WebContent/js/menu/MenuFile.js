function MenuFile() {
	var graphics = new createjs.Graphics().beginFill("BLACK").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	var background = new createjs.Shape(graphics);
	background.x = 0;
	background.y = 0;
	
	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill(BLACK).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	hitArea.x = 0;
	hitArea.y = 0;
	background.hitArea = hitArea;
	
	background.addEventListener("click", function() {
		return;
	});
	
	var container = new createjs.Container();
	container.addChild(background);
	
	var currentWidth = 0;
	var currentHeight = 0;
		
	container.addChild(drawBorderedRectangle(currentWidth, currentHeight, stage.canvas.width, 100, {background: BLACK, stroke: WHITE}));
	
	container.addChild(createText("FILE", WHITE, stage.canvas.width / 2, 30*DPR, 500));
	
	currentHeight += 100;

	var fileViewer = drawBorderedRectangle(stage.canvas.width / 4, currentHeight, 3 *(stage.canvas.width / 4), stage.canvas.height - currentHeight, {background: BLACK, stroke: WHITE});
	
	var mainFileContainer = new createjs.Container();
	mainFileContainer.addChild(fileViewer);
	container.addChild(mainFileContainer);
		
	
	var MENU_FILE_PAGE_SIZE = 6;
	
	var elemHeight = (stage.canvas.height - 100) / MENU_FILE_PAGE_SIZE;
	
	var files = player.getFiles();
	console.log(files);
	
	for (var i = 0; i < MENU_FILE_PAGE_SIZE; i++) {
		container.addChild(drawBorderedRectangle(currentWidth, currentHeight, stage.canvas.width / 4, elemHeight, {background: BLACK, stroke: WHITE}));
		if (i < files.length) {
			var file = files[i];
			var fileBanner = convertImageToScaledBitmap(file.banner, 0, currentHeight, stage.canvas.width / 4, elemHeight);
			fileBanner.addEventListener("click", updateCurrentFileDelegate(file));
			container.addChild(fileBanner);
		}
		currentHeight += elemHeight;
	}
		
	var backArrow = drawArrow("rgba(0,0,0,0.5)", "white", DIRECTION_MENU_BACK, true);

	backArrow.addEventListener("click", function(evt) {
		container.removeAllChildren();
		stage.update();
	});
	
	container.addChild(backArrow);
	
	function updateCurrentFileDelegate(file) {
		return function() {
			updateCurrentFile(file);
		}
	}
	
	function updateCurrentFile(file) {
		mainFileContainer.removeAllChildren();
		var img = convertImageToScaledBitmap(file.img, stage.canvas.width / 4, 100, 3*(stage.canvas.width/4), stage.canvas.height - 100);
		mainFileContainer.addChild(img);
		
		var txt = createText(file.text, WHITE, stage.canvas.width / 4, 170, 3*(stage.canvas.width/4), stage.canvas.width - 100);
		mainFileContainer.addChild(txt);
		stage.update();
	}
	
	return container;
	
}