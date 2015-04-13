var stage;
var layers = {};
	layers.sceneLayer = new createjs.Container();
	layers.menuLayer = new createjs.Container();
	layers.UILayer = new createjs.Container();
	
var images = {"test": "hello"};	
	
var player;
var priority = 0;
var switches = [];
var textSpeed = TEXT_SPEED_DEFAULT;