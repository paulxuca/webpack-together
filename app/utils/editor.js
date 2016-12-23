import { MODE_MAP } from './constants';

export const getFiletype = (fileName) => {
  return MODE_MAP[fileName.split('.')[fileName.split('.').length - 1]];
}

export const getMode = (fileName, aceInstance) => require.ensure([], () => {
  const mode = getFiletype(fileName);
  if (mode === MODE_MAP.js) {
    require('brace/mode/jsx');
  } else if (mode === MODE_MAP.html) {
    require('brace/mode/html');
  } else if (mode === MODE_MAP.css) {
    require('brace/mode/css');
  } else if (mode === MODE_MAP.coffee) {
    require('brace/mode/coffee');
  } else if (mode === MODE_MAP.json) {
    require('brace/mode/json');
  } else if(mode === MODE_MAP.tsx) {
    require('brace/mode/typescript');
  } else if (mode === MODE_MAP.scss) {
    require('brace/mode/scss');
  } else if (mode === MODE_MAP.less) {
    require('brace/mode/less');
  }
  aceInstance && aceInstance.getSession().setMode(`ace/mode/${mode}`);
});