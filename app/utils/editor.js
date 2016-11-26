const MODE_MAP = {
  js: 'jsx',
  css: 'css',
  ts: 'text/typescript',
  tsx: 'text/typescript',
  coffee: 'text/x-cofeescript',
  less: 'text/x-less',
  scss: 'text/x-sass',
  html: 'htmlmixed',
  vue: 'htmlmixed',
  json: 'application/json',
};

export const getMode = (fileName) => MODE_MAP[fileName.split('.')[fileName.split('.').length - 1]];

export const setMode = (mode, cmInstance) => require.ensure([], () => {
  console.log(`setting mode ${mode}`);
  if (mode === 'htmlmixed') {
    require('codemirror/mode/htmlmixed/htmlmixed.js');
    require('codemirror/addon/edit/matchtags.js');
    require('codemirror/addon/edit/closetag.js');
  } else if (mode === 'jsx') {
    require('codemirror/mode/jsx/jsx.js');
  } else if (mode === 'text/typescript') {
    require('codemirror/mode/javascript/javascript.js');
  }
  cmInstance.setOption('mode', mode);
});