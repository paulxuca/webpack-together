const requireDir = require('require-dir');
const boilerplates = requireDir('./boilerplates');

module.exports = {
  getBoilerplate(index) {
    const boilerplateName = Object.keys(boilerplates)[index];
    return boilerplates[boilerplateName];
  }
};
