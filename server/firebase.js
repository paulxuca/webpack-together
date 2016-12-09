const firebase = require('firebase');
const moment = require('moment');
const uuid = require('uuid');
const sessions = require('./sessions');
const boilerplates = require('./boilerplates');
const firebaseConfig = require('./config').firebase;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const getSessionRef = sessionName => database.ref(`sessions/${sessionName}`);

const activeClean = async () => {
  console.log(`Purging firebase at ${new moment().format()}`)
  const currentTime = new moment();
  const currentSessions = await database.ref('sessions').once('value').then(snapshot => snapshot);

  currentSessions.forEach((child) => {
    const sessionLastEditedDate = child.val().lastEdited;
    if (moment.duration(currentTime.diff(sessionLastEditedDate)).asMinutes() > 60) {
      sessions.remove(child.key);
    }
  });
}

const getConfig = async sessionName => {
  const { webpack, entryFile, packages } = await getSessionRef(sessionName).once('value').then((snapshot) => snapshot.val());
  return { webpack, entryFile, packages };
}

const createSession = (id = 0) => new Promise((resolve) => {
  const sessionName = uuid();
  const firebaseRef = getSessionRef(sessionName);
  const boilerplate = boilerplates.getBoilerplate(id);
  firebaseRef.set({
    lastEdited: Date.now(),
    entryFile: boilerplate.entry,
    webpack: boilerplate.webpack,
    packages: boilerplate.packages,
    isCompiling: true,
  });
  const firebaseChildRef = firebaseRef.child('files');
  boilerplate.files.forEach((file) => {
    firebaseChildRef.push()
      .set({
        name: file.name,
        content: file.content,
        isEdited: false,
      });
  });
  resolve(sessionName);
});

const createFile = (fileName, isEntry, sessionName) => new Promise(async (resolve) => {
  const firebaseRef = getSessionRef(sessionName);
  if (isEntry) {
    firebaseRef.update({
      entryFile: fileName,
    });
  }
  firebaseRef.child('files').push()
  .set({
    name: fileName,
    content: '',
  });
  resolve();
});

const deleteFile = (fileHash, sessionName) => new Promise((resolve, reject) => {
 const firebaseRef = getSessionRef(sessionName);
 firebaseRef.child(`files/${fileHash}`)
  .remove()
  .then(() => resolve())
  .catch((error) => reject(error));
});

const getFileState = sessionName => new Promise( async resolve => {
  const currentFiles = [];
  const firebaseRef = getSessionRef(sessionName).child('files');
  const filesList = await firebaseRef.once('value');
  filesList.forEach((childFile) => {
    firebaseRef.child(childFile.key).update({
      isEdited: false,
    });
    currentFiles.push(childFile.val());
  });
  resolve(currentFiles);
});

const saveAll = sessionName => {
  return new Promise(async (resolve) => {
    const currentFiles = [];
    const mainFirebaseRef = getSessionRef(sessionName);
    mainFirebaseRef.update({
      isCompiling: true,
    });
    resolve(await getFileState(sessionName));
  });
};

const hasCompiled = sessionName => {
  getSessionRef(sessionName).update({
    isCompiling: false,
  });
};

const setCompiling = sessionName => {
  getSessionRef(sessionName).update({
    isCompiling: true,
  });
};

module.exports = {
  createSession,
  saveAll,
  createFile,
  deleteFile,
  getConfig,
  activeClean,
  hasCompiled,
  getFileState,
  setCompiling,
};


