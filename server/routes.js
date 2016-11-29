const firebase = require('./firebase');
const utils = require('./utils');
const filesystem = require('./filesystem');
const bundle = require('./bundle');
const sessions = require('./sessions');

const handleError = (error, res) => {
  console.log(error);
  res.status(400).json(error);
}

const getSession = async (req, res) => {
  try {
    const session = await firebase.createSession();
    res.status(200).json(session);
  } catch (error) {
    handleError(error, res);
  }
};

const postSaveAll = async (req, res) => {
  const {
    sessionName
  } = req.body;

  try {
    const { webpack, entryFile } = await firebase.getConfig(sessionName);
    const currentFilestate = await firebase.saveAll(sessionName);
    console.log(`Recompiling session ${sessionName}`);
    await filesystem.updateSessionFiles(currentFilestate, sessionName);
    if (!sessions.hasBundle(sessionName)) {
      await bundle.ensureBundle(sessionName, webpack, entryFile);
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
};

