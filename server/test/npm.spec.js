const npm = require('../npm');

const testDownloadPackage = () => {
  npm.installPackages(['react', 'react-dom']);
};

testDownloadPackage();