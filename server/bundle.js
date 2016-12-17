const loaders = require('./loaders');
const serverConfig = require('./config');
const vendor = require('./vendor');
const fs = require('./filesystem');
const webpack = require('webpack');
const path = require('path');
const sessions = require('./sessions');
const hasCompiledFnFirebase = require('./firebase').hasCompiled;

const getEntryPoint = (sessionName, entryFile) => path.resolve(process.cwd(), 'sessions', sessionName, 'files', entryFile);
const getPublicPath = sessionName =>  path.join('/', 'api', 'sandbox', sessionName);

const createWebpackConfig = (sessionName, vendorHash, webpackConfig, entryFile) => {
  const loaderConfig = loaders.createLoaders(webpackConfig.loaders);
  const vendorManifest = vendor.getVendorManifest(vendorHash);
  
  return {
    loaderConfig: webpackConfig.loaders,
    config: {
      devtool: 'cheap-module-eval-source-map',
      entry: [
        getEntryPoint(sessionName, entryFile),
      ],
      resolve: {
        modules: [
          path.resolve(process.cwd(), 'packages', 'node_modules'),
        ],
      },
      output: {
        path: getPublicPath(sessionName),
        publicPath: getPublicPath(sessionName),
        filename: 'bundle.js',
      },
      module: {
        loaders: loaderConfig,
      },
      plugins: [
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: vendorManifest,
        }),
      ],
    }
  }
};

module.exports = {
  getPublicPath,
  createWebpackConfig,
  updateBundle(sessionName, vendorHash, webpackConfig, entryFile) {
    return new Promise((resolve) => {
      const { config, loaderConfig } = createWebpackConfig(sessionName, vendorHash, webpackConfig, entryFile);

      sessions
        .addSession(
          sessionName,
          config,
          hasCompiledFnFirebase,
          loaderConfig,
          vendorHash
        )
        .then(() => resolve());
    });
  },
};
