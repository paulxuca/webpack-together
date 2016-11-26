import firebase from 'firebase';
import 'firebase/database';

export const initializeFirebase = (config) => firebase.initializeApp(config);
export const getRefByName = (name) => firebase.database().ref(`sessions/${name}`);
export const updateToFirebase = (name, fileIndex, fileValue) =>
  firebase.database().ref(`sessions/${name}/files/${fileIndex}`).update({ content: fileValue });

export const updateSessionData = name => firebase.database().ref(`sessions/${name}`).update({ lastEdited: Date.now() });
export const createNewFile = (name, fileName, isEntry) => firebase.database().ref(`sessions/${name}`).child('files').push().set({
  name: fileName,
  isEntry: isEntry,
  content: '',
});