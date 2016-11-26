const firebase = require('firebase');
const uuid = require('uuid');
const sessions = require('./sessions');
const firebaseConfig = require('./config').firebase;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const createSession = () => new Promise((resolve, reject) => {
  const sessionName = uuid();
  const firebaseRef = firebase.database().ref(`sessions/${sessionName}`);
  firebaseRef.set({ lastEdited: Date.now() });
  firebaseRef.child('files')
  .push()
  .set({
    name: 'app.js',
    isEntry: true,
    content: '// Write your application code here!',
  });
  firebaseRef.child('files')
  .push()
  .set({
    name: 'index.html',
    isEntry: false,
    content:`<html>\n</html>`
  });
  const session = sessions.addSession(sessionName, firebaseRef);
  resolve(sessionName);
});
module.exports = {
  createSession,
};


