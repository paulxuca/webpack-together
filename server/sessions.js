const sessions = {};
const app = require('./app').app;
const fs = require('./filesystem').fs;
const firebase = require('./firebase');
const path = require('path');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const _ = require('lodash');

class EmitHandler {
  constructor(sessionName, emitter) {
    this.sessionName = sessionName;
    this.emitter = emitter;
    this.handler = _.debounce(this.handler.bind(this), 300);
  }
  
  handler() {
    this.emitter(this.sessionName);
  }
}

module.exports = {
  addSession: (sessionName, config, handler) => new Promise((resolve) => {
    const compiler = webpack(config);
    const dev = devMiddleware(compiler, {
      publicPath: config.output.publicPath,
      stats: {
        chunks: false,
        colors: true,
      },
    });

    sessions[sessionName] = {
      sessionHandler: new EmitHandler(sessionName, handler),
      sessionName,
      dev,
    };

    compiler.plugin('done', sessions[sessionName].sessionHandler.handler);
    
    app.use(sessions[sessionName].dev);
    resolve();
  }),
  getSession(sessionName) {
    return sessions[sessionName];
  },
  removeSession(sessionName) {
    delete sessions[sessionName];
  },
  hasBundle(sessionName) {
    return Object.keys(sessions).indexOf(sessionName) !== -1
  },
  initializeSessionBundles() {
    fs.emptyDirSync(path.resolve(process.cwd(), 'sessions'));
  }
};
