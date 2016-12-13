import firebase from 'firebase';
import 'firebase/database';

export const initializeFirebase = (config) => firebase.initializeApp(config);
export const getRefByName = (name) => firebase.database().ref(`sessions/${name}`);
export const updateToFirebase = (firebaseRef, fileIndex, fileValue) => {
  firebaseRef
    .child('files')
    .child(fileIndex)
    .update({
      content: fileValue,
      isEdited: true,
    });
};

export const changeSessionLoaders = (firebaseRef, newLoaders) => {
  firebaseRef
    .child('webpack')
    .update({
      loaders: newLoaders,
    });
};

export const changeSessionPackages = (firebaseRef, newPackages) => {
  firebaseRef
    .update({
      packages: newPackages.map(e => ({ name: e})),
    });
}

export const updateSessionData = firebaseRef => firebaseRef.update({ lastEdited: Date.now() });