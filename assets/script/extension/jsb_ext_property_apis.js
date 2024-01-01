var _proto = cc.Control.prototype;
cc.defineGetterSetter(_proto, "opacityModifyRGB", _proto.isOpacityModifyRGB, _proto.setOpacityModifyRGB);
cc.defineGetterSetter(_proto, "state", _proto.getState);
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);
cc.defineGetterSetter(_proto, "selected", _proto.isSelected, _proto.setSelected);
cc.defineGetterSetter(_proto, "highlighted", _proto.isHighlighted, _proto.setHighlighted);

_proto = cc.ControlButton.prototype;
cc.defineGetterSetter(_proto, "color", _proto.getColor, _proto.setColor);
cc.defineGetterSetter(_proto, "opacity", _proto.getOpacity, _proto.setOpacity);
cc.defineGetterSetter(_proto, "adjustBackgroundImage", _proto.getAdjustBackgroundImage, _proto.setAdjustBackgroundImage);
cc.defineGetterSetter(_proto, "zoomOnTouchDown", _proto.getZoomOnTouchDown, _proto.setZoomOnTouchDown);
cc.defineGetterSetter(_proto, "preferredSize", _proto.getPreferredSize, _proto.setPreferredSize);
cc.defineGetterSetter(_proto, "labelAnchor", _proto.getLabelAnchorPoint, _proto.setLabelAnchorPoint);

_proto = cc.ControlColourPicker.prototype;
cc.defineGetterSetter(_proto, "color", _proto.getColor, _proto.setColor);
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);
cc.defineGetterSetter(_proto, "background", _proto.getBackground);

_proto = cc.ControlHuePicker.prototype;
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);
cc.defineGetterSetter(_proto, "hue", _proto.getHue, _proto.setHue);
cc.defineGetterSetter(_proto, "huePercent", _proto.getHuePercentage, _proto.setHuePercentage);
cc.defineGetterSetter(_proto, "background", _proto.getBackground);
cc.defineGetterSetter(_proto, "slider", _proto.getSlider);
cc.defineGetterSetter(_proto, "startPos", _proto.getStartPos);

_proto = cc.ControlPotentiometer.prototype;
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);
cc.defineGetterSetter(_proto, "value", _proto.getValue, _proto.setValue);
cc.defineGetterSetter(_proto, "minValue", _proto.getMinimumValue, _proto.setMinimumValue);
cc.defineGetterSetter(_proto, "maxValue", _proto.getMaximumValue, _proto.setMaximumValue);
cc.defineGetterSetter(_proto, "progressTimer", _proto.getProgressTimer, _proto.setProgressTimer);
cc.defineGetterSetter(_proto, "thumbSprite", _proto.getThumbSprite, _proto.setThumbSprite);
cc.defineGetterSetter(_proto, "prevLocation", _proto.getPreviousLocation, _proto.setPreviousLocation);

_proto = cc.ControlSaturationBrightnessPicker.prototype;
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);
cc.defineGetterSetter(_proto, "saturation", _proto.getSaturation);
cc.defineGetterSetter(_proto, "brightness", _proto.getBrightness);
cc.defineGetterSetter(_proto, "background", _proto.getBackground);
cc.defineGetterSetter(_proto, "overlay", _proto.getOverlay);
cc.defineGetterSetter(_proto, "shadow", _proto.getShadow);
cc.defineGetterSetter(_proto, "slider", _proto.getSlider);
cc.defineGetterSetter(_proto, "startPos", _proto.getStartPos);

_proto = cc.ControlSlider.prototype;
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);
cc.defineGetterSetter(_proto, "value", _proto.getValue, _proto.setValue);
cc.defineGetterSetter(_proto, "minValue", _proto.getMinimumValue, _proto.setMinimumValue);
cc.defineGetterSetter(_proto, "maxValue", _proto.getMaximumValue, _proto.setMaximumValue);
cc.defineGetterSetter(_proto, "minAllowedValue", _proto.getMinimumAllowedValue, _proto.setMinimumAllowedValue);
cc.defineGetterSetter(_proto, "maxAllowedValue", _proto.getMaximumAllowedValue, _proto.setMaximumAllowedValue);
cc.defineGetterSetter(_proto, "thumbSprite", _proto.getThumbSprite);
cc.defineGetterSetter(_proto, "progressSprite", _proto.getProgressSprite);
cc.defineGetterSetter(_proto, "backgroundSprite", _proto.getBackgroundSprite);

_proto = cc.ControlSwitch.prototype;
cc.defineGetterSetter(_proto, "enabled", _proto.isEnabled, _proto.setEnabled);

_proto = cc.ScrollView.prototype;
cc.defineGetterSetter(_proto, "width", _proto._getWidth, _proto._setWidth);
cc.defineGetterSetter(_proto, "height", _proto._getHeight, _proto._setHeight);
cc.defineGetterSetter(_proto, "direction", _proto.getDirection, _proto.setDirection);

_proto = cc.ControlStepper.prototype;
cc.defineGetterSetter(_proto, "wraps", _proto.getWraps, _proto.setWraps);
cc.defineGetterSetter(_proto, "value", _proto.getValue, _proto.setValue);
cc.defineGetterSetter(_proto, "minValue", _proto.getMinimumValue, _proto.setMinimumValue);
cc.defineGetterSetter(_proto, "maxValue", _proto.getMaximumValue, _proto.setMaximumValue);
cc.defineGetterSetter(_proto, "stepValue", _proto.getStepValue, _proto.setStepValue);
cc.defineGetterSetter(_proto, "continuous", _proto.isContinuous);
cc.defineGetterSetter(_proto, "minusSprite", _proto.getMinusSprite, _proto.setMinusSprite);
cc.defineGetterSetter(_proto, "plusSprite", _proto.getPlusSprite, _proto.setPlusSprite);
cc.defineGetterSetter(_proto, "minusLabel", _proto.getMinusLabel, _proto.setMinusLabel);
cc.defineGetterSetter(_proto, "plusSLabel", _proto.getPlusSLabel, _proto.setPlusSLabel);

_proto = cc.TableViewCell.prototype;
cc.defineGetterSetter(_proto, "objectId", _proto.getObjectID, _proto.setObjectID);