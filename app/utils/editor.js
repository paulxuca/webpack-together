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

export const setMode = (mode, cmInstance) => {
  console.log(`setting mode ${mode}`)
  if (mode === 'htmlmixed') {
    require('codemirror/mode/htmlmixed/htmlmixed.js');
  } else if (mode === 'jsx') {
    require('codemirror/mode/jsx/jsx.js');
  }
  cmInstance.setOption('mode', mode);
}