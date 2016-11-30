const firebase = require('./firebase');
const utils = require('./utils');
const filesystem = require('./filesystem');
const bundle = require('./bundle');
const sessions = require('./sessions');

const handleError = (error, res) => {
  console.log(error);
  res.status(400).json(error);
}


/*
* Creates a new session, and starts the bundle build process and watching.
*/
const getSession = async (req, res) => {
  try {
    const sessionName = await firebase.createSession();
    const { webpack, entryFile } = await firebase.getConfig(sessionName);
    await bundle.updateBundle(sessionName, webpack, entryFile);
    res.status(200).json(sessionName);
  } catch (error) {
    handleError(error, res);
  }
};

/*
* Session exists, but is not building on the server. this starts the webpack build process.
*/
const ensureSession = async (req, res) => {
  try {
    const { sessionName } = req.body;

    const currentFilestate = await firebase.getFileState(sessionName);
    await filesystem.updateSessionFiles(currentFilestate, sessionName);

    if (!sessions.hasBundle(sessionName)) {
      const { webpack, entryFile } = await firebase.getConfig(sessionName);
      await bundle.updateBundle(sessionName, webpack, entryFile);
    }
    firebase.hasCompiled(sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
};

const postSaveAll = async (req, res) => {
  const {
    sessionName
  } = req.body;

  console.log(`Recompiling session ${sessionName}`);

  try {
    const { webpack, entryFile } = await firebase.getConfig(sessionName);
    const currentFilestate = await firebase.saveAll(sessionName);
    await filesystem.updateSessionFiles(currentFilestate, sessionName);
    if (!sessions.hasBundle(sessionName)) {
      await bundle.updateBundle(sessionName, webpack, entryFile);
    }
    firebase.hasCompiled(sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
};

postNewFile = async (req, res) => {
  const { fileName, isEntry, sessionName } = req.body;
  try {
    await firebase.createFile(fileName, isEntry, sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
};

module.exports = {
  getSession,
  postNewFile,
  postSaveAll,
  ensureSession
};

