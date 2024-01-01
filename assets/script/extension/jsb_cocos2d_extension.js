jsb.AssetsManager = cc.AssetsManager;
delete cc.AssetsManager;

jsb.EventListenerAssetsManager = cc.EventListenerAssetsManager;
delete cc.EventListenerAssetsManager;

jsb.EventAssetsManager = cc.EventAssetsManager;
delete cc.EventAssetsManager;

cc.ControlButton.extend = cc.Class.extend;
cc.ControlColourPicker.extend = cc.Class.extend;
cc.ControlPotentiometer.extend = cc.Class.extend;
cc.ControlSlider.extend = cc.Class.extend;
cc.ControlStepper.extend = cc.Class.extend;
cc.ControlSwitch.extend = cc.Class.extend;

var cc = cc || {};

cc.SCROLLVIEW_DIRECTION_NONE = -1;
cc.SCROLLVIEW_DIRECTION_HORIZONTAL = 0;
cc.SCROLLVIEW_DIRECTION_VERTICAL = 1;
cc.SCROLLVIEW_DIRECTION_BOTH = 2;
cc.TABLEVIEW_FILL_TOPDOWN = 0;
cc.TABLEVIEW_FILL_BOTTOMUP = 1;

cc.KEYBOARD_RETURNTYPE_DEFAULT = 0;

cc.KEYBOARD_RETURNTYPE_DONE = 1;

cc.KEYBOARD_RETURNTYPE_SEND = 2;

cc.KEYBOARD_RETURNTYPE_SEARCH = 3;

cc.KEYBOARD_RETURNTYPE_GO = 4;

cc.EDITBOX_INPUT_MODE_ANY = 0;

cc.EDITBOX_INPUT_MODE_EMAILADDR = 1;

cc.EDITBOX_INPUT_MODE_NUMERIC = 2;

cc.EDITBOX_INPUT_MODE_PHONENUMBER = 3;

cc.EDITBOX_INPUT_MODE_URL = 4;

cc.EDITBOX_INPUT_MODE_DECIMAL = 5;

cc.EDITBOX_INPUT_MODE_SINGLELINE = 6;

cc.EDITBOX_INPUT_FLAG_PASSWORD = 0;

cc.EDITBOX_INPUT_FLAG_SENSITIVE = 1;

cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD = 2;

cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE = 3;

cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS = 4;

cc.CONTROL_EVENT_TOTAL_NUMBER = 9;

cc.CONTROL_EVENT_TOUCH_DOWN = 1 << 0;    
cc.CONTROL_EVENT_TOUCH_DRAG_INSIDE = 1 << 1;    
cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE = 1 << 2;    
cc.CONTROL_EVENT_TOUCH_DRAG_ENTER = 1 << 3;    
cc.CONTROL_EVENT_TOUCH_DRAG_EXIT = 1 << 4;    
cc.CONTROL_EVENT_TOUCH_UP_INSIDE = 1 << 5;    
cc.CONTROL_EVENT_TOUCH_UP_OUTSIDE = 1 << 6;    
cc.CONTROL_EVENT_TOUCH_CANCEL = 1 << 7;    
cc.CONTROL_EVENT_VALUECHANGED = 1 << 8;    

cc.CONTROL_STATE_NORMAL = 1 << 0; 
cc.CONTROL_STATE_HIGHLIGHTED = 1 << 1; 
cc.CONTROL_STATE_DISABLED = 1 << 2; 
cc.CONTROL_STATE_SELECTED = 1 << 3;  
cc.CONTROL_STATE_INITIAL = 1 << 3;

cc.CONTROL_ZOOM_ACTION_TAG = 0xCCCB0001;       

cc.CONTROL_STEPPER_PARTMINUS = 0;               
cc.CONTROL_STEPPER_PARTPLUS = 1;
cc.CONTROL_STEPPER_PARTNONE = 2;
cc.CONTROL_STEPPER_LABELCOLOR_ENABLED = cc.color(55, 55, 55);
cc.CONTROL_STEPPER_LABELCOLOR_DISABLED = cc.color(147, 147, 147);
cc.CONTROL_STEPPER_LABELFONT = "CourierNewPSMT";
cc.AUTOREPEAT_DELTATIME = 0.15;
cc.AUTOREPEAT_INCREASETIME_INCREMENT = 12;

jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
jsb.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
jsb.EventAssetsManager.NEW_VERSION_FOUND = 3;
jsb.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
jsb.EventAssetsManager.UPDATE_PROGRESSION = 5;
jsb.EventAssetsManager.ASSET_UPDATED = 6;
jsb.EventAssetsManager.ERROR_UPDATING = 7;
jsb.EventAssetsManager.UPDATE_FINISHED = 8;
jsb.EventAssetsManager.UPDATE_FAILED = 9;
jsb.EventAssetsManager.ERROR_DECOMPRESS = 10;

cc.ScrollView.extend = cc.Class.extend;
cc.TableView.extend = cc.Class.extend;
cc.TableViewCell.extend = cc.Class.extend;