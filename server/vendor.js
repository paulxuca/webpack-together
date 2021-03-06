const webpack = require('webpack');
const hash = require('string-hash');

const fs = require('./filesystem');
const npm = require('./npm');
const path = require('path');
const config = require('./config');
const utils = require('./utils');
const errors = require('./constants').errors;
const walk = require('./walk');
const filesystem = require('./filesystem');

const getPathForVendor = vendorHash => path.resolve(process.cwd(), 'vendor', vendorHash);
const getPathForVendorFile = vendorHash => path.resolve(process.cwd(), 'vendor', vendorHash, `dll.vendor_${vendorHash}.js`);
const vendorHashRegex = new RegExp(/vendor_(.+).js/);

const promiseWebpackRun = (config) => new Promise((resolve, reject) => {
  webpack(config).run(err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});

const existsVendorBundle = (vendorHash) => {
  return fs.fs.existsSync(getPathForVendor(vendorHash));
};


const createVendors = async (packageList) => {
  return new Promise((resolve, reject) => {
    const vendorHashes = packageList.reduce((allHashes, each) => {
      const hashedVendor = String(hash(each));
      if (!existsVendorBundle(hashedVendor)) {
        return allHashes.concat(hashedVendor);
      }
      return allHashes;
    }, []);

    if (vendorHashes.length) {
      const vendorConfigs = vendorHashes.map((eachHash, index) => {
        return {
          entry: {
            [`vendor_${eachHash}`]: [packageList[index]],
          },
          output: {
            path: getPathForVendor(eachHash),
            filename: 'dll.[name].js',
            library: '[name]'
          },
          resolve: {
            modules: [
              path.resolve(process.cwd(), 'packages', 'node_modules')
            ],
          },
          plugins: [
            new webpack.DllPlugin({
              path: path.join(getPathForVendor(eachHash), 'manifest.json'),
              name: '[name]',
              context: process.cwd(),
            }),
          ],
        };
      });
      Promise
        .all(vendorConfigs.map(each => promiseWebpackRun(each)))
        .then(() => resolve())
        .catch((err) => reject(err));
    } else {
      resolve();
    }
  });
};


module.exports = {
  getPathForVendor,
  createVendors,
  getVendorManifest:(vendorHash) => {
    try {
      return JSON.parse(fs.fs.readFileSync(path.join(getPathForVendor(vendorHash), 'manifest.json')).toString());
    } catch (err) {
      return err;
    }
  },
  initializeVendorFolder() {
    console.log('Initalizing Vendor folder!');
    fs.fs.emptyDirSync(path.resolve(process.cwd(), 'vendor'));
    fs.fs.ensureDirSync(path.resolve(process.cwd(), 'packages'));
    if (!fs.fs.existsSync(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'))) {
      fs.fs.outputJsonSync(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'), {});
    }
  },
  createVendor(packages) {
    return new Promise((resolve, reject) => {
      const vendorHash = utils.createVendorName(packages);
      fs.fs.ensureDirSync(getPathForVendor(vendorHash));

      const vendorPkgs = packages.reduce((allPkgs, eachPkg) => {
        if (fs.fs.existsSync(path.resolve(process.cwd(), 'packages', 'node_modules', eachPkg))) {
          return allPkgs.concat(eachPkg);
        }
        return allPkgs;
      }, []);

      const vendorConfig = {
        entry: {
          vendor: vendorPkgs,
        },
        output: {
          path: getPathForVendor(vendorHash),
          filename: 'dll.[name].js',
          library: '[name]',
        },
        resolve: {
          modules: [
            path.resolve(process.cwd(), 'packages', 'node_modules')
          ],
        },
        plugins: [
          new webpack.DllPlugin({
            path: path.join(getPathForVendor(vendorHash), 'manifest.json'),
            name: '[name]',
            context: process.cwd(),
          }),
        ]
      };
      const webpackVendorCompiler = webpack(vendorConfig);
      webpackVendorCompiler.run((err) => {
        if (err) {
          console.log('Error compiling vendor', err);
          reject(new Error(errors.VENDOR_COMPILER_ERROR));
        }
        resolve();
      });
    });
  },
  existsVendorBundle,
  ensurePackages: (packageList) => new Promise((resolve, reject) => {
    npm
      .installPackages(packageList)
      .then(() => resolve())
      .catch((err) => reject(new Error(errors.PACKAGE_INSTALL_ERROR)));
  }),
  getVendorFile(req, res) {
    const vHash = req.params.vendorHash.match(vendorHashRegex)[1];
    if (fs.fs.existsSync(getPathForVendorFile(vHash))) {
      const vendorFile = fs.fs.readFileSync(getPathForVendorFile(vHash));
      res.setHeader('Cache-Control', `${utils.isProduction() ? config.cache.prod : config.cache.dev}`);
      res.setHeader('Content-Length', vendorFile.length);
      res.setHeader('Content-Type', 'application/javascript');
      res.send(vendorFile);
    } else {
      res.sendStatus(404);  
    }
  }
}