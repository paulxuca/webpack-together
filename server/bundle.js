const loaders = require('./loaders');
const serverConfig = require('./config');
const vendor = require('./vendor');
const fs = require('./filesystem');
const webpack = require('webpack');
const hash = require('string-hash');
const path = require('path');
const sessions = require('./sessions');
const hasCompiledFnFirebase = require('./firebase').hasCompiled;

const getEntryPoint = (sessionName, entryFile) => path.resolve(process.cwd(), 'sessions', sessionName, 'files', entryFile);
const getPublicPath = sessionName =>  path.join('/', 'api', 'sandbox', sessionName);

const createWebpackConfig = (sessionName, packageList, webpackConfig, entryFile) => {
  return new Promise(async (resolve) => {
    const loaderConfig = loaders.createLoaders(webpackConfig.loaders);
    // const vendorManifest = await vendor.getVenacdorManifest(vendorHash);

    const vendorPlugins = packageList.map((each) => {
      const vendorManifest = vendor.getVendorManifest(String(hash(each)));
      return new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: vendorManifest,
      });
    });

    resolve({
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
          ...vendorPlugins,
        ],
      }
    });
  });
};

const updateBundle = (sessionName, packageList, webpackConfig, entryFile) => {
  return new Promise(async (resolve, reject) => {
    const { config, loaderConfig } = await createWebpackConfig(sessionName, packageList, webpackConfig, entryFile);

    sessions
      .addSession(
        sessionName,
        config,
        hasCompiledFnFirebase,
        loaderConfig,
        packageList
      )
      .then(() => resolve())
      .catch((addSessionError) => {
        reject(addSessionError);
      });
  });
};

module.exports = {
  getPublicPath,
  createWebpackConfig,
  updateBundle,
};
