/* eslint-env browser */
import { useEffect, useChannel, useCallback } from "@storybook/addons";
import { UPDATE_GLOBALS } from "@storybook/core-events";
import { drawSelectedElement } from "./box-model/visualizer";
import { init, rescale, destroy } from "./box-model/canvas";
import { useHotKey } from "./useHotKey";
import { deepElementFromPoint } from "./util";
var nodeAtPointerRef;
export var withMeasure = function withMeasure(StoryFn, context) {
  var measureEnabled = context.globals.measureEnabled;
  var emit = useChannel({});
  var updateGlobals = useCallback(function (newGlobals) {
    return emit(UPDATE_GLOBALS, {
      globals: newGlobals
    });
  }, [emit]);
  useEffect(function () {
    return useHotKey(updateGlobals);
  }, []);
  useEffect(function () {
    var onMouseOver = function onMouseOver(event) {
      window.requestAnimationFrame(function () {
        event.stopPropagation();
        nodeAtPointerRef = deepElementFromPoint(event.clientX, event.clientY);
        drawSelectedElement(nodeAtPointerRef);
      });
    };

    var onResize = function onResize() {
      window.requestAnimationFrame(function () {
        rescale();
      });
    };

    if (measureEnabled) {
      init();
      document.addEventListener("mouseover", onMouseOver);
      window.addEventListener("resize", onResize);
    }

    return function () {
      document.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("resize", onResize);
      destroy();
    };
  }, [measureEnabled]);
  return StoryFn();
};