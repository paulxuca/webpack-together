const firebase = require('./firebase');
const utils = require('./utils');
const filesystem = require('./filesystem');
const bundle = require('./bundle');
const sessions = require('./sessions');
const vendor = require('./vendor');
const intentEnum = require('./intent_enum');
const walk = require('./walk');
const boilerplates = require('./boilerplates');

const mergeSessionData = (sessionConfig, sessionName) => Object.assign({}, sessionConfig, { sessionName });
const handleError = (error, res, sessionName) => {
  console.log(error.message);
  console.log(error.stack);
  firebase.hasCompiled(sessionName);
  res.status(400).json(error);
};

const logUpdate = (sessionName, loaders, packages) => console.log(`Updating session ${sessionName}, loaders: ${loaders}, packages: ${packages}`);

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
      const sessionName = await firebase.createSession();
      req.sessionName = sessionName;
      res.cookie('sessionName', sessionName, { expires: new Date(Date.now() + 3600000) });
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
    const packageList = await walk.findAllModules(currentFilestate);

    await vendor.ensurePackages(packageList);
    await vendor.createVendors(packageList);
    await filesystem.updateSessionFiles(currentFilestate, sessionName);
    await filesystem.updateIndexFile(sessionName, packageList);

    const hasBundle = sessions.hasBundle(sessionName);

    if (hasBundle) {
      const invalidateLoaders = sessions.shouldInvalidateLoaders(sessionName, sessionConfig.webpack);
      const invalidatePackages = sessions.shouldInvalidatePackages(sessionName, packageList);
      if (invalidateLoaders || invalidatePackages) {
        logUpdate(sessionName, invalidateLoaders, invalidatePackages);
        const { config, loaderConfig } = await bundle.createWebpackConfig(sessionName, packageList, sessionConfig.webpack, sessionConfig.entryFile);
        await sessions.updateSession(sessionName, config, loaderConfig, packageList);
      }
    } else {
      await bundle.updateBundle(sessionName, packageList, sessionConfig.webpack, sessionConfig.entryFile);      
    }

    res.status(200).json(sessionConfig);
  } catch (error) {
    handleError(error, res, sessionName);
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

