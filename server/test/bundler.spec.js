require('babel-register');
require('babel-polyfill');
const vendor = require('../vendor');

const testPackagesBundler = () => {
  const packages = ['react', 'react-dom'];
  vendor.createVendors(packages);
};

testPackagesBundler();