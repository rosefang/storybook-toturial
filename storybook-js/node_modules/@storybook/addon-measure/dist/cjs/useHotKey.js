"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHotKey = useHotKey;

function focusInInput(event) {
  return /input|textarea/i.test(event.target.tagName) || event.target.getAttribute("contenteditable") !== null;
}

function useHotKey(updateGlobals) {
  var onKeyDown = function onKeyDown(event) {
    if (!focusInInput(event) && event.key === "Alt") {
      updateGlobals({
        measureEnabled: true
      });
    }
  };

  var onKeyUp = function onKeyUp(event) {
    if (event.key === "Alt") {
      updateGlobals({
        measureEnabled: false
      });
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  return function () {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  };
}