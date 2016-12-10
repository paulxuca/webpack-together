const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = require('./webpack.base.config')({
  entry: [],
  cssLoader: ExtractTextPlugin.extract({
    loader: 'css-loader',
  }),
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'bundle_[hash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin({
      filename: 'assets/styles.css',
      allChunks: true,
    }),
  ],
});