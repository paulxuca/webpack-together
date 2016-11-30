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

    // Making our compiler use memory fs for files input and output
    compiler.inputFileSystem = memoryFs;
    compiler.outputFileSystem = memoryFs;
    compiler.resolvers.normal.fileSystem = memoryFs;
    compiler.resolvers.context.fileSystem = memoryFs;
    
    const dev = devMiddleware(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        chunks: false,
        colors: true,
      }
    });
    const hot = hotMiddleware(compiler);

    sessions[sessionName] = {
      sessionName,
      dev,
      hot,
    };

    app.use(sessions[sessionName].dev);
    app.use(sessions[sessionName].hot);
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
