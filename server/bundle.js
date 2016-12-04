const sessions = require('./sessions');
const loaders = require('./loaders');
const serverConfig = require('./config');
const webpack = require('webpack');
const path = require('path');

const getEntryPoint = (sessionName, entryFile) => path.resolve(process.cwd(), 'sessions', sessionName, 'files', entryFile);
const getPublicPath = sessionName =>  path.join('/', 'api', 'sandbox', sessionName);

module.exports = {
  getPublicPath,
  updateBundle(sessionName, webpackConfig, entryFile) {
    if(!sessions[sessionName]) {
      const loaderConfig = loaders.createLoaders(webpackConfig.loaders);
      const config = {
        devtool: 'cheap-module-eval-source-map',
        entry: [
          `webpack-hot-middleware/client?path=http://${config.api.dev.baseUrl}${getPublicPath(sessionName)}`,
          getEntryPoint(sessionName, entryFile),
        ],
        output: {
          path: getPublicPath(sessionName),
          publicPath: getPublicPath(sessionName),
          filename: 'bundle.js',
        },
        module: {
          loaders: loaderConfig,
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.NoErrorsPlugin(),
        ],
      };
      sessions.addSession(sessionName, config);
    }
  }
}