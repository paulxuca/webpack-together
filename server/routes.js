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

const intentMiddleware = async (req, res, next) => {
  const { sessionName } = req.cookies;
  switch (req.body.intent) {
    case intentEnum.ADD_FILE:
      const { fileName, isEntry } = req.body;
      await firebase.createFile(fileName, isEntry, sessionName);
      next();
    case intentEnum.REMOVE_FILE:
      const { fileHash } = req.body;
      await firebase.deleteFile(fileHash, sessionName);
      next();
    default:
      next();
  }
};

const sandboxMiddleware = async (req, res, next) => {
  if (sessions.hasBundle(req.cookies.sessionName)) {
    req.sessionName = req.cookies.sessionName;
    next();
  } else {
    req.sessionName = await firebase.createSession();
    next();
  }
};

const mergeSessionData = (sessionConfig, sessionName) => Object.assign({}, sessionConfig, { sessionName });

const update = async (req, res) => {
  const { sessionName } = req;
  firebase.setCompiling(sessionName);

  try {
    const sessionConfig = await firebase.getConfig(sessionName);
    const currentFilestate = await firebase.getFileState(sessionName);
    const vendorHash = vendor.createVendorName(sessionConfig.packages);

    await filesystem.updateSessionFiles(currentFilestate, vendorHash, sessionName);
    if (!vendor.existsVendorBundle(vendorHash)) {
      await vendor.createVendor(vendorHash, sessionConfig.packages);
    }
    if (!sessions.hasBundle(sessionName)) {
      await bundle.updateBundle(sessionName, vendorHash, sessionConfig.webpack, sessionConfig.entryFile);
    }

    res.status(200).json(mergeSessionData(sessionConfig, sessionName));
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = {
  update,
  intentMiddleware,
  sandboxMiddleware,
};

