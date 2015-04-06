function initMenu() {
	var menuBar = new createjs.Container();
	var menuIconWidth = stage.canvas.width / MENU_ICONS;
	var currentWidth = 0;
	
	var icons = [MENU_INVENTORY, MENU_PARTY, MENU_SAVE];
	
	for (var i = 0; i < icons.length; i++) {
		var icon = new MenuIcon(icons[i], menuIconWidth, MENU_HEIGHT);
		icon.x = currentWidth;
		icon.y = 0;
		menuBar.addChild(icon);
		
		currentWidth += menuIconWidth;
	}
	
	stage.addChild(menuBar);
	stage.update();
	return stage;
}