const sampleBoiler = require('../boilerplates/react.json');
const vendor = require('../vendor');

const testVendorGen = () => {
  const vendorName = vendor.createVendorName(sampleBoiler.packages);
  vendor.createVendor(vendorName, sampleBoiler.packages)
    .then(() => console.log('success!'))
    .catch((err) => console.log(err));
}

testVendorGen();