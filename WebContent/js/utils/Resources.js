var DPR = 2;

var MENU_HEIGHT = 50 * DPR;
var MENU_INVENTORY = "INVENTORY";
var MENU_PARTY = "PARTY";
var MENU_SAVE = "SAVE";
var MENU_ICONS = 3;

var MENU_ANIMATION_PIXELS_PER_SECOND = 500 * DPR;

var FONT_SIZE = 20 * DPR;
var FONT_FAMILY = "Raleway";
var FONT = FONT_SIZE + "px " + FONT_FAMILY;

var MAX_INVENTORY_SIZE = 8;
var INVENTORY_MAIN_ITEM_RECIPROCAL_WIDTH = 3;
var INVENTORY_MAIN_ITEM_RECIPROCAL_HEIGHT = 3;

var ITEM_CONTAINER_WIDTH = 60 * DPR;
var ITEM_CONTAINER_HEIGHT = 60 * DPR;
var ITEM_CONTAINER_ITEM_WIDTH = 50 * DPR;
var ITEM_CONTAINER_ITEM_HEIGHT = 50 * DPR;

var CLICKABLE_CONTAINER_NAME = "clickableContainer";

var DIALOG_SCRIPT_X = -15 * DPR;
var DIALOG_IMAGE_WIDTH = 375 * DPR;
var DIALOG_IMAGE_HEIGHT = 500 * DPR;
var DIALOG_HEIGHT = 350 * DPR;
var DIALOG_NAME_HEIGHT = 50 * DPR;

var TEXT_SPEED_SLOW = 50;
var TEXT_SPEED_MEDIUM = 35;
var TEXT_SPEED_FAST = 20;
var TEXT_SPEED_DEFAULT = TEXT_SPEED_MEDIUM;

var KEYCODES = {
		"SPACE": 32,
		"LEFT": 37,
		"UP": 38,
		"RIGHT": 39,
		"DOWN": 40
}

var SPEAKER_WIDTH = 30 * DPR;
var SPEAKER_HEIGHT = 30 * DPR;

var CHARACTER_NAMES = {};
	CHARACTER_NAMES["ALBERT"] = "Albert";
	CHARACTER_NAMES["ZAK"] = "Zak";
	CHARACTER_NAMES["KATE"] = "Kate";
	CHARACTER_NAMES["TOM"] = "Tom";
	CHARACTER_NAMES["KEVIN"] = "Kevin";
	CHARACTER_NAMES["SOPHIE"] = "Sophie";
	CHARACTER_NAMES["VICTORIA"] = "Victoria";
	CHARACTER_NAMES["JOE"] = "Joe";

var DIALOG_IMAGES = {};
	DIALOG_IMAGES["ALBERT"] = "albert";
	DIALOG_IMAGES["ALBERT-HAPPY"] = "albert-happy";
	DIALOG_IMAGES["ALBERT-FLIRTATIOUS"] = "albert-flirtatious";
	DIALOG_IMAGES["ALBERT-DETERMINED"] = "albert-determined";
	
	DIALOG_IMAGES["KATE"] = "kate";
	DIALOG_IMAGES["KATE-HAPPY"] = "kate-happy";
	DIALOG_IMAGES["KATE-SAD"] = "kate-sad";
	DIALOG_IMAGES["KATE-CURIOUS"] = "kate-curious";
	
	DIALOG_IMAGES["TOM"] = "tom";
	DIALOG_IMAGES["TOM-HAPPY"] = "tom-happy";
	DIALOG_IMAGES["TOM-ANGRY"] = "tom-angry";
	DIALOG_IMAGES["TOM-DEVASTATED"] = "tom-devastated";
	DIALOG_IMAGES["TOM-SAD"] = "tom-sad";
	DIALOG_IMAGES["TOM-SMITTEN"] = "tom-smitten";
	
	DIALOG_IMAGES["ZAK"] = "zak";
	
	DIALOG_IMAGES["KEVIN"] = "kevin";
	
	DIALOG_IMAGES["SOPHIE"] = "sophie";
	DIALOG_IMAGES["SOPHIE-CURIOUS"] = "sophie-curious";
	DIALOG_IMAGES["SOPHIE-SLY"] = "sophie-sly";
	
	DIALOG_IMAGES["VICTORIA"] = "victoria";
	DIALOG_IMAGES["VICTORIA-HAPPY"] = "victoria-happy";
	DIALOG_IMAGES["VICTORIA-POSSESSED"] = "victoria-possessed";
	DIALOG_IMAGES["VICTORIA-TERRIFIED"] = "victoria-terrified";

var DIRECTION_LEFT = "LEFT";
var DIRECTION_RIGHT = "RIGHT";
var DIRECTION_BACK = "BACK";

var CLICKABLE_EXAMINE = "EXAMINE";
var CLICKABLE_ITEM = "ITEM";

var LOWEST_PRIORITY = 0;
var ITEM_PRIORITY = 0;
var MENU_PRIORITY = 0;
var NAVIGATION_PRIORITY = 0;

var CUTSCENE_PRIORITY = 1;
var ITEM_GAINED_PRIORITY = 1;

var MUTE_PRIORITY = 2;

var FROZEN_PRIORITY = 3;

var BLACK = "#000000";
var WHITE = "#FFFFFF";

var VEIL_COLOUR = BLACK;
var VEIL_TRANSPARENCY = 0.4;
var VEIL_ANIMATION_OPACITY_PER_SECOND = VEIL_TRANSPARENCY;