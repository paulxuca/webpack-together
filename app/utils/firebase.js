import firebase from 'firebase';
import 'firebase/database';

export const initializeFirebase = (config) => firebase.initializeApp(config);
export const getRefByName = (name) => firebase.database().ref(`sessions/${name}`);
export const updateToFirebase = (name, fileIndex, fileValue) =>
  firebase.database().ref(`sessions/${name}/files/${fileIndex}`).update({ content: fileValue });