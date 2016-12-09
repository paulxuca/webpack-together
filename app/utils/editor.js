import { MODE_MAP } from './constants';

export const getMode = (fileName) => {
  const mode = MODE_MAP[fileName.split('.')[fileName.split('.').length - 1]];
  if (mode === MODE_MAP.js) {
    require('brace/mode/jsx');
  } else if (mode === MODE_MAP.html) {
    require('brace/mode/html');
  } else if (mode === MODE_MAP.css) {
    require('brace/mode/css');
  }
  return mode;
}
