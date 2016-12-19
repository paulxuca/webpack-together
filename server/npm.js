const path = require('path');
const fs = require('fs-extra');
const npmi = require('npmi');
const packageQueue = [];

const installPackage = (pkgName) => {
  return new Promise((resolve, reject) => {
    npmi({
      name: pkgName,
      path: path.resolve(process.cwd(), 'packages'),
      npmLoad: {
        loglevel: 'silent',
      },
    }, (err, result) => {
      if (err) {
        if (err.code === npmi.LOAD_ERR) reject('Npm load Error');
        if (err.code === npmi.INSTALL_ERR) reject('Npm install Error');
      } else {
        packageQueue.shift();
        resolve();
      }
    });
  })
}

const installPackages = async (packageList) => new Promise(async (resolve, reject) => {

  
  try {    
    const currentPackages = fs.readJsonSync(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'));
    const pkgList = [].concat(packageList).filter(e => !currentPackages[e] && packageQueue.indexOf(e) === -1);
    packageQueue.push(pkgList);
    for (var i = 0; i < pkgList.length; i++) {
      await installPackage(pkgList[i]);
    }
    const newPackages = pkgList.reduce((t, e) => {
      t[e] = e;
      return t;
    }, {});
    fs.writeJSON(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'), Object.assign({}, currentPackages, newPackages), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  } catch (error) {
    console.log(error);
    reject(error);
  }
});

module.exports = {
  installPackages,
};