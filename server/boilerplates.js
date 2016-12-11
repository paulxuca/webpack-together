const requireDir = require('require-dir');
const boilerplates = requireDir('./boilerplates');
const loaderOptions = require('./api/loaders');

module.exports = {
  getBoilerplate(index) {
    const boilerplateName = Object.keys(boilerplates)[index];
    return boilerplates[boilerplateName];
  },
  getLoadersOptions() {
    return loaderOptions;
  }
};
