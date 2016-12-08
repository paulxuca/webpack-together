const firebase = require('./firebase');
const utils = require('./utils');
const filesystem = require('./filesystem');
const bundle = require('./bundle');
const sessions = require('./sessions');
const vendor = require('./vendor');

const handleError = (error, res) => {
  console.log(error);
  res.status(400).json(error);
}

const update = async (req, res) => {

  let sessionName;
  if (req.body && req.body.sessionName) {
    sessionName = req.body.sessionName;
    firebase.setCompiling(sessionName);
  } else {
    sessionName = await firebase.createSession();
  }


  try {
    const {
      webpack,
      entryFile,
      packages,
    } = await firebase.getConfig(sessionName);
    const currentFilestate = await firebase.getFileState(sessionName);
    const vendorHash = vendor.createVendorName(packages);

    await filesystem.updateSessionFiles(currentFilestate, vendorHash, sessionName);
    if (!vendor.existsVendorBundle(vendorHash)) {
      await vendor.createVendor(vendorHash, packages);
    }
    if (!sessions.hasBundle(sessionName)) {
      await bundle.updateBundle(sessionName, vendorHash, webpack, entryFile);
    }
    firebase.hasCompiled(sessionName);
    res.status(200).json(sessionName);
  } catch (error) {
    handleError(error, res);
  }
}

postNewFile = async (req, res) => {
  const { fileName, isEntry, sessionName } = req.body;
  try {
    await firebase.createFile(fileName, isEntry, sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
};

postDeleteFile = async (req, res) => {
  const { fileHash, sessionName } = req.body;
  try {
    await firebase.deleteFile(fileHash, sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  postNewFile,
  postDeleteFile,
  update,
};

