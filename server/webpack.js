const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.dev.config');
const compiler = webpack(webpackConfig);

module.exports = {
  dev: {
    devMiddleware: require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    }),
    hotMiddleware: require('webpack-hot-middleware')(compiler),
  }
};
