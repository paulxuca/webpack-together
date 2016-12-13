const firebase = require('./firebase');
const utils = require('./utils');
const filesystem = require('./filesystem');
const bundle = require('./bundle');
const sessions = require('./sessions');
const vendor = require('./vendor');
const intentEnum = require('./intent_enum');
const boilerplates = require('./boilerplates');

const mergeSessionData = (sessionConfig, sessionName) => Object.assign({}, sessionConfig, { sessionName });
const handleError = (error, res) => {
  console.log(error);
  res.status(400).json(error);
}

const intentMiddleware = async (req, res, next) => {
  const { sessionName } = req.cookies;
  if (req.body.intent === intentEnum.ADD_FILE) {
    const { fileName, isEntry } = req.body;
    await firebase.createFile(fileName, isEntry, sessionName);
  } else {
    const { fileHash } = req.body;
    await firebase.deleteFile(fileHash, sessionName);
  }
  next();
};

const sandboxMiddleware = async (req, res, next) => {
  if (req.cookies.sessionName) {
    req.sessionName = req.cookies.sessionName;
    next();
  } else {
    try {
      req.sessionName = await firebase.createSession();
      next();
    } catch (err) {
      handleError(err, res);
    }
  }
};

const update = async (req, res) => {
  const { sessionName } = req;
  firebase.setCompiling(sessionName);

  try {
    const sessionConfig = await firebase.getConfig(sessionName);
    const currentFilestate = await firebase.getFileState(sessionName);
    const vendorHash = vendor.createVendorName(sessionConfig.packages);

    await filesystem.updateSessionFiles(currentFilestate, vendorHash, sessionName);
    

    // Invalidate Clauses here (different loaders, packages)
    if (!vendor.existsVendorBundle(vendorHash)) {
      await vendor.ensurePackages(sessionConfig.packages);
      await vendor.createVendor(vendorHash, sessionConfig.packages);
    }
    
    const hasBundle = sessions.hasBundle(sessionName);
    let invalidatingLoaders;
    let invalidatingPackages;

    if (hasBundle) {
      invalidatingLoaders = sessions.shouldInvalidateLoaders(sessionConfig.webpack, sessionName);
      invalidatingPackages = sessions.shouldInvalidatePackages(vendorHash, sessionName);

      if (invalidatingLoaders || invalidatingPackages) {
        const { config, loaderConfig } = bundle.createWebpackConfig(sessionName, vendorHash, sessionConfig.webpack, sessionConfig.entryFile);
        sessions.updateSession(sessionName, config, loaderConfig, vendorHash, invalidatingLoaders, invalidatingPackages);
      }
    }

    if (!sessions.hasBundle(sessionName)) {
      await bundle.updateBundle(sessionName, vendorHash, sessionConfig.webpack, sessionConfig.entryFile);
    }

    res.status(200).json(mergeSessionData(sessionConfig, sessionName));
  } catch (error) {
    handleError(error, res);
  }
};

const loaderOptions = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600000');
  res.status(200).json(boilerplates.getLoadersOptions());
}

module.exports = {
  update,
  intentMiddleware,
  sandboxMiddleware,
  loaderOptions,
};

