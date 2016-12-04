const firebase = require('firebase');
const moment = require('moment');
const uuid = require('uuid');
const sessions = require('./sessions');
const boilerplates = require('./boilerplates');
const firebaseConfig = require('./config').firebase;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const getSessionRef = sessionName => database.ref(`sessions/${sessionName}`);

const activeClean = () => {
  console.log(`Purging firebase at ${Date.now()}`)
  const currentTime = new moment();
  database.ref('sessions').once('value', (snapshot) => {
    snapshot.forEach((firebaseSession) => {
      const sessionLastEditedDate = firebaseSession.val().lastEdited;
      if (moment.duration(currentTime.diff(sessionLastEditedDate)).asMinutes() > 60) {
        sessions.removeSession(firebaseSession.key);        
        firebaseSession.remove();
      }
    });
  });
}

const getConfig = async sessionName => {
  const { webpack, entryFile } = await getSessionRef(sessionName).once('value').then((snapshot) => snapshot.val());
  return { webpack, entryFile };
}

const createSession = (id = 0) => new Promise((resolve) => {
  const sessionName = uuid();
  const firebaseRef = getSessionRef(sessionName);
  const boilerplate = boilerplates.getBoilerplate(id);
  firebaseRef.set({
    lastEdited: Date.now(),
    entryFile: boilerplate.entry,
    webpack: boilerplate.webpack,
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

module.exports = {
  createSession,
  saveAll,
  createFile,
  getConfig,
  activeClean,
  hasCompiled,
  getFileState,
};


