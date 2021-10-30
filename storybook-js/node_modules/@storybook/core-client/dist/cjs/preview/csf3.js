"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCsf3Enabled = void 0;

var _global = _interopRequireDefault(require("global"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PREVIEW_CSF_V3 = _global.default.PREVIEW_CSF_V3;

var isCsf3Enabled = function isCsf3Enabled() {
  try {
    return !!PREVIEW_CSF_V3;
  } catch (e) {
    return false;
  }
};

exports.isCsf3Enabled = isCsf3Enabled;