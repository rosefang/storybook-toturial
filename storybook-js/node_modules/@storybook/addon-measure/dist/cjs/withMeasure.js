"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withMeasure = void 0;

var _addons = require("@storybook/addons");

var _coreEvents = require("@storybook/core-events");

var _visualizer = require("./box-model/visualizer");

var _canvas = require("./box-model/canvas");

var _useHotKey = require("./useHotKey");

var _util = require("./util");

/* eslint-env browser */
var nodeAtPointerRef;

var withMeasure = function withMeasure(StoryFn, context) {
  var measureEnabled = context.globals.measureEnabled;
  var emit = (0, _addons.useChannel)({});
  var updateGlobals = (0, _addons.useCallback)(function (newGlobals) {
    return emit(_coreEvents.UPDATE_GLOBALS, {
      globals: newGlobals
    });
  }, [emit]);
  (0, _addons.useEffect)(function () {
    return (0, _useHotKey.useHotKey)(updateGlobals);
  }, []);
  (0, _addons.useEffect)(function () {
    var onMouseOver = function onMouseOver(event) {
      window.requestAnimationFrame(function () {
        event.stopPropagation();
        nodeAtPointerRef = (0, _util.deepElementFromPoint)(event.clientX, event.clientY);
        (0, _visualizer.drawSelectedElement)(nodeAtPointerRef);
      });
    };

    var onResize = function onResize() {
      window.requestAnimationFrame(function () {
        (0, _canvas.rescale)();
      });
    };

    if (measureEnabled) {
      (0, _canvas.init)();
      document.addEventListener("mouseover", onMouseOver);
      window.addEventListener("resize", onResize);
    }

    return function () {
      document.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("resize", onResize);
      (0, _canvas.destroy)();
    };
  }, [measureEnabled]);
  return StoryFn();
};

exports.withMeasure = withMeasure;