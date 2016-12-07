const hash = require('string-hash');
const webpack = require('webpack');
const fs = require('./filesystem');
const path = require('path');

const getPathForVendor = (vendorHash) => path.resolve(process.cwd(), 'vendor', vendorHash);

module.exports = {
  createVendorName: (packages) => {
    if (!packages) return null;
    return hash(JSON.stringify(packages.reduce((all, ea) => {
      return all + ea.name;
    }, ''))).toString();
  },
  initializeVendorFolder() {
    fs.fs.ensureDirSync(path.resolve(process.cwd(), 'vendor'));
  },
  createVendor(vendorHash, packages) {
    return new Promise((resolve, reject) => {
      console.log(`Creating vendor bundle with ${packages.length} packages`);
      fs.fs.ensureDirSync(getPathForVendor(vendorHash));
      const vendorPkgs = packages.reduce((allPkgs, eachPkg) => {
        if (fs.fs.existsSync(path.resolve(process.cwd(), 'node_modules', each.name))) {
          return allPkgs.concat(eachPkg.name);
        }
        return allPkgs;
      }, []);
      const vendorConfig = {
        entry: {
          vendors: vendorPkgs,
        },
        ouput: {
          path: getPathForVendor(vendorHash),
          filename: 'vendor.js',
        },
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production'),
            }
          }),
          new webpack.DLLPlugin({
            path: path.join(getPathForVendor(vendorHash), 'manifest.json'),
            name: 'wbvendors',
            context: path.resolve(process.cwd()),
          })
        ]
      };

      const webpackVendorCompiler = webpack(vendorConfig);
      compiler.run((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  },
  existsVendorBundle(vendorHash) {
    return fs.fs.existsSync(getPathForVendor(vendorHash));
  }
}