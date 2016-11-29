const sessions = require('./sessions');
const loaders = require('./loaders');
const webpack = require('webpack');
const path = require('path');

const getEntryPoint = (sessionName, entryFile) => path.resolve(process.cwd(), 'sessions', sessionName, 'files', entryFile);
const getOutputPoint = sessionName => path.resolve(process.cwd(), 'sessions', sessionName, 'public');


module.exports = {
  ensureBundle(sessionName, webpackConfig, entryFile) {
    if(!sessions[sessionName]) {
      const loaderConfig = loaders.createLoaders(webpackConfig.loaders);
      const config = {
        devtool: 'cheap-module-eval-source-map',
        entry: {
          main: getEntryPoint(sessionName, entryFile),
        },
        output: {
          path: getOutputPoint(sessionName),
          publicPath: '',
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