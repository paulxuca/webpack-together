const sessions = require('./sessions');
const loaders = require('./loaders');
const api = require('./api');
const webpack = require('webpack');
const path = require('path');

const getEntryPoint = (sessionName, entryFile) => path.resolve(process.cwd(), 'sessions', sessionName, 'files', entryFile);
const getOutputPoint = sessionName => path.resolve(process.cwd(), 'sessions', sessionName, 'public');
const getPublicPath = sessionName =>  path.resolve(process.cwd(), 'api', 'sandbox', sessionName);

module.exports = {
  getPublicPath,
  ensureBundle(sessionName, webpackConfig, entryFile) {
    if(!sessions[sessionName]) {
      const loaderConfig = loaders.createLoaders(webpackConfig.loaders);
      const config = {
        devtool: 'cheap-module-eval-source-map',
        entry: [
          `webpack-hot-middleware/client?path=http://${api.getBaseUrl}/__webpack_hmr`,
          getEntryPoint(sessionName, entryFile),
        ],
        output: {
          path: getOutputPoint(sessionName),
          publicPath: getPublicPath(sessionName),
          filename: `bundle_${sessionName}.js`,
        },
        module: {
          loaders: loaderConfig,
        },
        plugins: [
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),
        ],
      };
      sessions.addSession(sessionName, config);
    }
  }
}