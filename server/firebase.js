const firebase = require('firebase');
const uuid = require('uuid');
const sessions = require('./sessions');
const firebaseConfig = require('./config').firebase;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const getSessionRef = sessionName => database.ref(`sessions/${sessionName}`);

const createSession = () => new Promise((resolve) => {
  const sessionName = uuid();
  const firebaseRef = getSessionRef(sessionName);
  firebaseRef.set({
    lastEdited: Date.now(),
    entryFile: 'app.js',
  });
  firebaseRef.child('files')
  .push()
  .set({
    name: 'app.js',
    isEdited: false,
    content: '// Write your application code here!',
  });
  firebaseRef.child('files')
  .push()
  .set({
    name: 'index.html',
    isEdited: false,
    content:`<html>\n</html>`
  });
  sessions.addSession(sessionName, firebaseRef);
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

const saveAll = sessionName => {
  return new Promise(async (resolve) => {
    const firebaseRef = getSessionRef(sessionName).child('files');
    const filesList = await firebaseRef.once('value');
    filesList.forEach((childFile) => {
      firebaseRef.child(childFile.key).update({
        isEdited: false,
      });
    });
    resolve();
  });
};

module.exports = {
  createSession,
  saveAll,
  createFile,
};


