const npmi = require('npmi');
const path = require('path');

const npmiDownload = pkgName => new Promise((resolve, reject) => {
  npmi({
    name: pkgName,
    path: path.resolve(process.cwd(), 'packages'),
  }, (err, result) => {
    if (err && (err.code === npmi.LOAD_ERR || err.code === npmi.INSTALL_ERR)) {
      reject(err);
    } else {
      resolve();
    }
  });
});

module.exports = {
  downloadPackage: pkgName => {
    return new Promise((resolve, reject) => {
      npmiDownload(pkgName)
        .then(() => resolve())
        .catch((err) => reject(err));
    });
  },
};
