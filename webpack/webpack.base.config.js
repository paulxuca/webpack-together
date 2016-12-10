const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (config) => ({
  entry: [
    'babel-polyfill',
    ...config.entry,
    path.resolve(process.cwd(), 'app', 'index.js'),
  ],
  plugins: [
    new HTMLWebpackPlugin({
      template: 'app/index.html',
      hash: false,
      inject: true,
    }),
    ...config.plugins,
  ],
  cache: config.cache,
  devtool: config.devtools,
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        plugins: ['transform-async-to-generator', 'transform-decorators-legacy'],
        presets: ['es2015', 'stage-0', 'react'],
      }
    }, {
      test: /\.css$/,
      loader: config.cssLoader,
    }, {
      test: /\.woff$/,
      loader: 'url-loader?limit=100000',
    }]
  },
  output: Object.assign({}, {
    path: path.resolve(process.cwd(), 'public'),
    publicPath: '',
    filename: 'bundle.js',
  }, config.output),
});