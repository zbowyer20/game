function Game() {	
	canvas = document.getElementById("canvas");
			
	console.log(canvas);
	
	stage = new createjs.Stage(canvas);
	
	player = new Player();
	
	stage.addChild(layers.sceneLayer);
	stage.addChild(layers.menuLayer);
	stage.addChild(layers.UILayer);
	
	initScene(stage);
	initMenu(stage, player);
	
}

/*
 * Create a veil over the entire stage
 * @returns The container containing the veil
 */
function createVeil() {
	var veilContainer = new createjs.Container();
	
	var graphics = new createjs.Graphics().beginFill(VEIL_COLOUR).drawRect(0, 0, stage.canvas.width, stage.canvas.height);
	var shape = new createjs.Shape(graphics);
	shape.alpha = VEIL_TRANSPARENCY; 
	
	veilContainer.addChild(shape);
	
	return veilContainer;
}