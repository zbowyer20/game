function Game() {	
	$(document).ready(function() {
		  $.ajaxSetup({ cache: false });
		});
	
	canvas = document.getElementById("canvas");	
	canvas.width = 1000 * DPR;
	canvas.style.width = "1000px";
	canvas.height = 600 * DPR;
	canvas.style.height = "600px";
	stage = new createjs.Stage(canvas);
	player = new Player();
	
	stage.addChild(layers.sceneLayer);
	stage.addChild(layers.menuLayer);
	stage.addChild(layers.UILayer);
	
	createjs.Ticker.addEventListener("tick", tick);
	function tick() { stage.update(); }
	
	Scene.init(2);
	//initMenu();
	
}