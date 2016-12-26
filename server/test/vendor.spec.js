const sampleBoiler = require('../boilerplates/react.json');
const vendor = require('../vendor');
const utils = require('../utils');

const testVendorGen = () => {
  const vendorName = utils.createVendorName(sampleBoiler.packages);
  vendor.createVendor(vendorName, sampleBoiler.packages)
    .then(() => console.log('success!'))
    .catch((err) => console.log(err));
}

testVendorGen();