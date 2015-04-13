function initMenu() {
	var menuBar = new createjs.Container();
	var menuIconDimensions = {"width": stage.canvas.width / MENU_ICONS, "height": MENU_HEIGHT};
	var current = {"width": 0};
	
	var icons = [MENU_INVENTORY, MENU_PARTY, MENU_SAVE];
	
	for (var i = 0; i < icons.length; i++) {
		var icon = new MenuIcon(icons[i], menuIconDimensions);
		icon.x = current.width;
		icon.y = 0;
		menuBar.addChild(icon);
		
		current.width += menuIconDimensions.width;
	}
	
	layers.UILayer.addChild(menuBar);
	stage.update();
	return stage;
}