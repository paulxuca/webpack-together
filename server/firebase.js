const firebase = require('firebase');
const uuid = require('uuid');
const sessions = require('./sessions');
const firebaseConfig = require('./config').firebase;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const createSession = () => new Promise((resolve, reject) => {
  const sessionName = uuid();
  const session = sessions.addSession(sessionName, firebase.database().ref(`sessions/${sessionName}`));
  resolve(sessionName);
});
module.exports = {
  createSession,
};


