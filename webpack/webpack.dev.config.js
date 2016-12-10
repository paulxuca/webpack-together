const webpack = require('webpack');
const serverConfig = require('../server/config');

const config = require('./webpack.base.config')({
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
  ],
  cache: true,
  devtool: 'eval',
  cssLoader: 'style-loader!css-loader',
});

module.exports = config;