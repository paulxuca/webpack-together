const sessions = {};
const app = require('./app').app;
const fs = require('./filesystem').fs;
const firebase = require('./firebase');
const path = require('path');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const _ = require('lodash');
const vendor = require('./vendor');

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

const updateSession = (
  sessionName,
  config,
  loaderConfig,
  vendorHash,
  invalidatedLoaders,
  invalidatedPackages,
) => {
  console.log(`updating session ${sessionName}, loaders: ${invalidatedLoaders}, packages: ${invalidatedPackages}`);
  
  sessions[sessionName].config.loaderConfig = loaderConfig;
  sessions[sessionName].config.vendorHash = vendorHash;
  sessions[sessionName].compiler = webpack(config);

  // Invalidate the compiler, to allow recompiling
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

const shouldInvalidateLoaders = (webpackConfig, sessionName) => {
  if (_.difference(webpackConfig.loaders, sessions[sessionName].config.loaderConfig).length > 0) {
    return true;
  }
  return false;
};

const shouldInvalidatePackages = (testVendorHash, sessionName) => {
  const currentVendorHash = sessions[sessionName].config.vendorHash;
  if (currentVendorHash !== testVendorHash) {
    return true;
  }
  return false;
}

const addSession = (sessionName, config, handler, loaderConfig, vendorHash) => {
  return new Promise((resolve, reject) => {
    console.log(config);
    try {
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
        webpackMiddleware,
        compiler,
        config: {
          sessionName,
          loaderConfig,
          vendorHash,
        }
      };

      compiler.plugin('done', sessions[sessionName].sessionHandler.handler);
      
      app.use(sessions[sessionName].webpackMiddleware);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  addSession,
  getSession,
  updateSession,
  removeSession,

  hasBundle,
  initializeSessionBundles,
  shouldInvalidateLoaders,
  shouldInvalidatePackages,
};
