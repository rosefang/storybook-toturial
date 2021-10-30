import global from 'global';
var PREVIEW_CSF_V3 = global.PREVIEW_CSF_V3;
export var isCsf3Enabled = function isCsf3Enabled() {
  try {
    return !!PREVIEW_CSF_V3;
  } catch (e) {
    return false;
  }
};