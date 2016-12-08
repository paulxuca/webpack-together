const sessions = require('./sessions');
const loaders = require('./loaders');
const serverConfig = require('./config');
const vendor = require('./vendor');
const fs = require('./filesystem');
const webpack = require('webpack');
const path = require('path');

const getEntryPoint = (sessionName, entryFile) => path.resolve(process.cwd(), 'sessions', sessionName, 'files', entryFile);
const getPublicPath = sessionName =>  path.join('/', 'api', 'sandbox', sessionName);

module.exports = {
  getPublicPath,
  updateBundle(sessionName, vendorHash, webpackConfig, entryFile) {
    return new Promise((resolve) => {
      if(!sessions[sessionName]) {
        const loaderConfig = loaders.createLoaders(webpackConfig.loaders);
        const vendorManifest = JSON.parse(fs.fs.readFileSync(path.join(vendor.getPathForVendor(vendorHash), 'manifest.json')).toString());

        const config = {
          devtool: 'cheap-module-eval-source-map',
          entry: [
            `webpack-hot-middleware/client?path=/api/sandbox/${sessionName}/__webpack_hmr&reload=true&quiet=true`,
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
            new webpack.DllReferencePlugin({
              context: process.cwd(),
              manifest: vendorManifest,
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.NamedModulesPlugin(),
          ],
        };
        sessions.addSession(sessionName, config)
        .then(() => resolve());
      }
    });
  }
}