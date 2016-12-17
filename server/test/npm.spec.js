require('babel-register');
require('babel-polyfill');
const npm = require('../npm');

const testDownloadPackage = () => {
  npm.installPackages(['react', 'react-dom', 'test']);
};

testDownloadPackage();