const sessions = {};
const app = require('./app').app;
const memoryFs = require('./filesystem').fs;
const path = require('path');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = {
  addSession(sessionName, config){
    const compiler = webpack(config);
    
    const dev = devMiddleware(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        chunks: false,
        colors: true,
      }
    });

    sessions[sessionName] = {
      sessionName,
      dev,
    };

    app.use(sessions[sessionName].dev);
    return sessions[sessionName];
  },
  getSession(sessionName) {
    return sessions[sessionName];
  },
  removeSession(sessionName) {
    delete sessions[sessionName];
  },
  hasBundle(sessionName) {
    return Object.keys(sessions).indexOf(sessionName) !== -1
  }
};
