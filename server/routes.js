const firebase = require('./firebase');
const utils = require('./utils');
const filesystem = require('./filesystem');
const bundle = require('./bundle');
const sessions = require('./sessions');
const vendor = require('./vendor');
const intentEnum = require('./intent_enum');

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

  if (req.body && req.body.intent) {
    if (req.body.intent === intentEnum.ADD_FILE) {
      const {
        fileName,
        isEntry,
      } = req.body;
      await firebase.createFile(fileName, isEntry, sessionName);
    } else if (req.body.intent === intentEnum.REMOVE_FILE) {
      const { fileHash } = req.body;
      await firebase.deleteFile(fileHash, sessionName);
    }
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

    res.status(200).json(sessionName);
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = {
  update,
};

