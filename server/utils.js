const randomColor = require('randomcolor');
const Moniker = require('moniker');

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
  isProduction() {
    return process.env.NODE_ENV === 'production';
  }
};
