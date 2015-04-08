var MENU_HEIGHT = 50;
var MENU_INVENTORY = "INVENTORY";
var MENU_PARTY = "PARTY";
var MENU_SAVE = "SAVE";
var MENU_ICONS = 3;

var MAX_INVENTORY_SIZE = 8;

var ITEM_CONTAINER_WIDTH = 60;
var ITEM_CONTAINER_HEIGHT = 60;

var DIALOG_SCRIPT_X = -15;
var DIALOG_IMAGE_WIDTH = 375;
var DIALOG_IMAGE_HEIGHT = 500;
var DIALOG_HEIGHT = 350;
var DIALOG_NAME_HEIGHT = 50;

var TEXT_SPEED_SLOW = 50;
var TEXT_SPEED_MEDIUM = 35;
var TEXT_SPEED_FAST = 20;
var TEXT_SPEED_DEFAULT = TEXT_SPEED_MEDIUM;

var SPEAKER_WIDTH = 30;
var SPEAKER_HEIGHT = 30;

var CHARACTER_NAMES = {};
	CHARACTER_NAMES["ALBERT"] = "Albert";
	CHARACTER_NAMES["ZAK"] = "Zak";
	CHARACTER_NAMES["KATE"] = "Kate";

var DIALOG_IMAGES = {};
	DIALOG_IMAGES["ALBERT"] = "albert";
	DIALOG_IMAGES["ALBERT-HAPPY"] = "albert-happy";
	DIALOG_IMAGES["ALBERT-FLIRTATIOUS"] = "albert-flirtatious";
	DIALOG_IMAGES["ALBERT-DETERMINED"] = "albert-determined";
	
	DIALOG_IMAGES["KATE"] = "kate";
	DIALOG_IMAGES["KATE-HAPPY"] = "kate-happy";
	DIALOG_IMAGES["KATE-SAD"] = "kate-sad";
	DIALOG_IMAGES["KATE-CURIOUS"] = "kate-curious";
	
	DIALOG_IMAGES["ZAK"] = "zak";

var DIRECTION_LEFT = "LEFT";
var DIRECTION_RIGHT = "RIGHT";

var CLICKABLE_EXAMINE = "EXAMINE";
var CLICKABLE_ITEM = "ITEM";

var LOWEST_PRIORITY = 0;
var ITEM_PRIORITY = 0;
var MENU_PRIORITY = 0;
var NAVIGATION_PRIORITY = 0;

var CUTSCENE_PRIORITY = 1;

var MUTE_PRIORITY = 2;

var FROZEN_PRIORITY = 3;