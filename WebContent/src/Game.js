function Game() {	
	canvas = document.getElementById("canvas");	
	stage = new createjs.Stage(canvas);
	player = new Player();
	
	stage.addChild(layers.sceneLayer);
	stage.addChild(layers.menuLayer);
	stage.addChild(layers.UILayer);
	
	initScene(stage);
	initMenu(stage, player);
	
}