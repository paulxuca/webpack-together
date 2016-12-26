const randomColor = require('randomcolor');
const Moniker = require('moniker');
const hash = require('string-hash');

const isInArray = (ele, arr) => arr.indexOf(ele) !== -1;

module.exports = {
  getColor(currentColors) {
    const color = randomColor();
    if (isInArray(color, currentColors)) {
      return getColor(currentColors);
    } else {
      return color;
    }
  },
  getDefaultUsername(currentUsers) {
    const userName = Moniker.choose();
    if (isInArray(userName, currentUsers)) {
      return getDefaultUsername(currentUsers);
    } else {
      return userName;
    }
  },
  createVendorName(packageList) {
    if (!packageList) return null;
    const vendorHash = hash(JSON.stringify(packageList.reduce((all, ea) => {
      return all + ea;
    }, ''))).toString();

    return vendorHash;
  },
  isProduction() {
    return process.env.NODE_ENV === 'production';
  }
};
