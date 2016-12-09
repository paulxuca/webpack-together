import { MODE_MAP } from './constants';

export const getMode = (fileName) => MODE_MAP[fileName.split('.')[fileName.split('.').length - 1]];

export const setMode = (mode, cmInstance, nextFileContents) => require.ensure([], () => {
  console.log(`setting mode ${mode}!`);  
  if (mode === 'htmlmixed') {
    require('codemirror/mode/htmlmixed/htmlmixed.js');
    require('codemirror/addon/edit/matchtags.js');
    require('codemirror/addon/edit/closetag.js');
  } else if (mode === 'jsx') {
    require('codemirror/mode/jsx/jsx.js');
  } else if (mode === 'text/typescript') {
    require('codemirror/mode/javascript/javascript.js');
  } else if (mode === 'css') {
    require('codemirror/mode/css/css.js');  
  }
  cmInstance.setOption('mode', mode);  
});