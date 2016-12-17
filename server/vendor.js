const hash = require('string-hash');
const webpack = require('webpack');
const fs = require('./filesystem');
const npm = require('./npm');
const path = require('path');
const config = require('./config');
const utils = require('./utils');
const walk = require('./walk');

const getPathForVendor = (vendorHash) => path.resolve(process.cwd(), 'vendor', vendorHash);
const getPathForVendorFile = vendorHash => path.resolve(process.cwd(), 'vendor', vendorHash, 'dll.vendor.js');
const vendorHashRegex = new RegExp(/vendor_(.+).js/);
const vendorHashCache = {}; // In memory cache for vendor hashes

module.exports = {
  getPathForVendor,
  createVendorName: (packages) => {
    if (!packages) return null;
    const vendorListString = JSON.stringify(packages);
    if (vendorHashCache[vendorListString]) {
      return vendorHashCache[vendorListString];
    }

    const vendorHash = hash(JSON.stringify(packages.reduce((all, ea) => {
      return all + ea;
    }, ''))).toString();
    vendorHashCache[vendorListString] = vendorHash;
    return vendorHash;
  },
  getVendorManifest:(vendorHash) => JSON.parse(fs.fs.readFileSync(path.join(getPathForVendor(vendorHash), 'manifest.json')).toString()),
  initializeVendorFolder() {
    console.log('Initalizing Vendor folder!');
    fs.fs.emptyDirSync(path.resolve(process.cwd(), 'vendor'));
    fs.fs.ensureDirSync(path.resolve(process.cwd(), 'packages'));
    if (!fs.fs.existsSync(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'))) {
      fs.fs.outputJsonSync(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'), {});
    }
  },
  createVendor(vendorHash, packages) {
    return new Promise((resolve, reject) => {
      console.log(`Creating vendor bundle with ${packages.length} packages`);
      fs.fs.ensureDirSync(getPathForVendor(vendorHash));
      const vendorPkgs = packages.reduce((allPkgs, eachPkg) => {
        if (fs.fs.existsSync(path.resolve(process.cwd(), 'packages', 'node_modules', eachPkg.name))) {
          const packageJSONInfo = fs.fs.readJsonSync(path.resolve(process.cwd(), 'packages', 'node_modules', eachPkg.name, 'package.json'));
          const mainEntryPath = path.resolve(
            process.cwd(),
            'packages',
            'node_modules',
            eachPkg.name,
            packageJSONInfo.main || 'index.js',
          );
          return allPkgs.concat(mainEntryPath);
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
          reject(err);
        }
        resolve();
      });
    });
  },
  existsVendorBundle(vendorHash) {
    return fs.fs.existsSync(getPathForVendor(vendorHash));
  },
  ensurePackages: (sessionName) => new Promise(async (resolve, reject) => {
    const packageList = walk.findAllModules(sessionName);
    try {
      await npm.installPackages(packageList);
      resolve();
    } catch (err) {
      console.log(err);
      reject(err);
    }
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