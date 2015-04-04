function Game() {
	canvas = document.getElementById("canvas");
			
	console.log(canvas);
	
	stage = new createjs.Stage(canvas);

	console.log('our test');
	console.log(stage.canvas.width);
	
	player = new Player();
	
	initScene(stage);
	initMenu(stage, player);
}