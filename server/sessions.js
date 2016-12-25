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
  packageConfig,
) => {
  return new Promise((resolve) => {
    sessions[sessionName].config.loaderConfig = loaderConfig;
    sessions[sessionName].config.packageConfig = packageConfig;
    sessions[sessionName].compiler = webpack(config);

    // Invalidate the compiler, to allow recompiling
    sessions[sessionName].webpackMiddleware.invalidate();
    resolve();
  });
};

const removeSession = (sessionName) => {
  console.log(`Removing session ${sessionName}`);
  delete sessions[sessionName];
  sessions[sessionName].webpackMiddleware.close();
};

const hasBundle = (sessionName) => {
  return Object.keys(sessions).indexOf(sessionName) !== -1
};

const initializeSessionBundles = () => {
  fs.emptyDirSync(path.resolve(process.cwd(), 'sessions'));
};

const shouldInvalidateLoaders = (sessionName, webpackConfig) => {
  const currentLoaderConfig = sessions[sessionName].config.loaderConfig;
  if (_.difference(webpackConfig.loaders, currentLoaderConfig).length || _.difference(currentLoaderConfig, webpackConfig.loaders).length) {
    return true;
  }
  return false;
};

const shouldInvalidatePackages = (sessionName, packageConfig) => {
  const currentPackageConfig = sessions[sessionName].config.packageConfig;
  if (_.difference(currentPackageConfig, packageConfig).length || _.difference(packageConfig, currentPackageConfig).length) {
    return true;
  }
  return false;
}

const addSession = (sessionName, config, handler, loaderConfig, packageConfig) => {
  return new Promise((resolve, reject) => {
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
          loaderConfig,
          packageConfig,
        }
      };

      compiler.plugin('done', sessions[sessionName].sessionHandler.handler);
      
      app.use(sessions[sessionName].webpackMiddleware);
      resolve();
    } catch (addSessionError) {
      reject(addSessionError);
    }
  });
};

module.exports = {
  addSession,
  getSession,
  updateSession,
  removeSession,
  sessions,

  hasBundle,
  initializeSessionBundles,
  shouldInvalidateLoaders,
  shouldInvalidatePackages,
};
