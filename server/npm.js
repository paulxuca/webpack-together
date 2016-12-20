const path = require('path');
const fs = require('fs-extra');
const npmi = require('npmi');

const installPeerDeps = packageName => {
  const packageJSON = fs.readJSONSync(path.resolve(process.cwd(), 'packages', 'node_modules', packageName, 'package.json'));
  return packageJSON.peerDependencies;
}

const installPackage = (pkgName) => {
  return new Promise((resolve, reject) => {
    console.log(`Installing package: ${pkgName}`);
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
        const peerDeps = installPeerDeps(pkgName);
        resolve(peerDeps && Object.keys(peerDeps));
      }
    });
  })
}

const installPackages = async (packageList) => new Promise(async (resolve, reject) => {
  try {    
    const currentPackages = fs.readJsonSync(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'));
    const pkgList = [].concat(packageList).filter(e => !currentPackages[e]);
    let peerPkgList = [];
    for (var i = 0; i < pkgList.length; i++) {
      const peerDeps = await installPackage(pkgList[i]);
      if (peerDeps) {
        peerPkgList.push(peerDeps);
      }
    }

    const newPackages = pkgList.reduce((t, e) => {
      t[e] = e;
      return t;
    }, {});

    fs.writeJSON(path.resolve(process.cwd(), 'packages', 'PACKAGE_LIST.json'), Object.assign({}, currentPackages, newPackages), (err) => {
      if (err) {
        reject(err);
      } else {
        if (peerPkgList.length) {
          installPackages(peerPkgList);
        }
        return resolve();      
      }
    });
  } catch (error) {
    console.log(error);
    reject(error);
  }
});

module.exports = {
  installPackages,
};