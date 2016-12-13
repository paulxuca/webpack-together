const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');

const YARN_CMD = 'yarn add';
const YARN_COMPLETE_CODE = 0;
const YARN_ERROR_CODE = 1;
const constructCommandArgs = (packageList) => [].concat(packageList).join(' ');

module.exports = {
  installPackages: packageList => new Promise((resolve, reject) => {
    const currentPackageList = Object.keys(fs.readJsonSync(path.resolve(process.cwd(), 'package.json')).dependencies);
    const filteredList = packageList.filter(pkg => currentPackageList.indexOf(pkg) === -1);

    if (filteredList.length) {
      const commandArgs = constructCommandArgs(filteredList);
      if (!shell.which('yarn')) {
        shell.echo('Yarn should be installed, this project relies on yarn');
        shell.exit(1);
      }
      shell.exec(`${YARN_CMD} ${commandArgs}`, (code, stdout, stderr) => {
        if (code === YARN_COMPLETE_CODE) {
          resolve();
        } else if (code === YARN_ERROR_CODE) {
          reject();
        }
      });
    }
    resolve();
  }),
};