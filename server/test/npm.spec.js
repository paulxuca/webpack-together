const npm = require('../npm');

const testDownloadPackage = () => {
  npm
    .downloadPackage('react')
    .then(() => {
      console.log('Success!');
    })
    .catch((err) => {
      console.log(err);
    });
};

testDownloadPackage();