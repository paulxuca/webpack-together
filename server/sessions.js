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

const getSession = (sessionName) => {
  return sessions[sessionName];
};

const updateSession = (sessionName, config, loaderConfig) => {
  console.log(`Updating session ${sessionName}`);  
  sessions[sessionName].loaderConfig = loaderConfig;


  const newCompilerConfig = _.merge(sessions[sessionName].compiler.options, config);
  sessions[sessionName].compiler.options = newCompilerConfig;
  //wtf is this, causing me so much pain
  sessions[sessionName].compiler.options.module.loaders = config.module.loaders;
  
  sessions[sessionName].webpackMiddleware.invalidate();
};

const removeSession = (sessionName) => {
  console.log(`Removing session ${sessionName}`);
  sessions[sessionName].webpackMiddleware.close();
};

const hasBundle = (sessionName) => {
  return Object.keys(sessions).indexOf(sessionName) !== -1
};

const initializeSessionBundles = () => {
  fs.emptyDirSync(path.resolve(process.cwd(), 'sessions'));
};

const shouldInvalidate = (webpackConfig, sessionName) => {
  if (sessions[sessionName]
  && _.difference(webpackConfig.loaders, sessions[sessionName].loaderConfig)) {
    return true;
  }
  return false;
};

module.exports = {
  addSession: (sessionName, config, handler, loaderConfig) => {
    return new Promise((resolve) => {
      const compiler = webpack(config);
      const sessionHandler = new EmitHandler(sessionName, handler);
      const webpackMiddleware = devMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
          chunks: false,
          colors: true,
        },
      });

      sessions[sessionName] = {
        sessionHandler,
        sessionName,
        webpackMiddleware,
        compiler,
        loaderConfig,
      };

      compiler.plugin('done', sessions[sessionName].sessionHandler.handler);
      
      app.use(sessions[sessionName].webpackMiddleware);
      resolve();
    });
  },
  getSession,
  updateSession,
  removeSession,
  hasBundle,
  initializeSessionBundles,
  shouldInvalidate,
};
