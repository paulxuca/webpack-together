import { observable, action, computed } from 'mobx';
import {
  getSession,
  saveAllAndAttemptCompiler,
  createNewFile,
  deleteFile,
  needsSave,
} from '../utils/sessions';
import {
  getRefByName,
  updateToFirebase,
  updateSessionData,
} from '../utils/firebase';

class App {
  @observable sessionName;
  @observable firebaseRef;
  @observable files;
  @observable currentFileIndex = 0;
  @observable filesKey = [];
  @observable entryFileName;
  @observable isCompiling;
  @observable canChangeIndex = true;

  @action getSession = async () => {
    try {
      this.sessionName = await getSession();
      this.firebaseRef = getRefByName(this.sessionName);
      this.firebaseRef.on('value', this.sessionListener);
      this.firebaseRef.on('child_changed', this.childListener);
    } catch (error) {
      console.log(error);
    }
  }

  @action changeSelectedFileIndex = (index) => this.currentFileIndex = index;

  childListener = (snapshot) => {
    this.filesKey = Object.keys(snapshot.val()).map((ea) => {
      return snapshot.val()[ea];
    });
  }

  sessionListener = (snapshot) => {
    const currentValue = snapshot.val();
    this.isCompiling = currentValue.isCompiling;
    this.entryFileName = currentValue.entryFile;
    this.files = Object.keys(currentValue.files).map((key) => {
      if (this.filesKey.indexOf(key) === -1) {
        this.filesKey.push(key);
      }
      return currentValue.files[key];
    });
  }

  @action writeToFirebase = (fileIndex, value) => {
    updateSessionData(this.firebaseRef);
    updateToFirebase(this.firebaseRef, this.filesKey[fileIndex], value);
  }

  @action newFiletoFirebase = (fileName, isEntry) => {
    updateSessionData(this.firebaseRef);
    createNewFile(this.sessionName, fileName, isEntry);
  }

  @action deleteFileToFirebase = (fileIndex) => {
    this.changeSelectedFileIndex(fileIndex - 1 >= 0 ? fileIndex - 1 : 0);
    updateSessionData(this.firebaseRef);
    deleteFile(this.sessionName, this.filesKey[fileIndex]);
  }

  @action saveFirebase = () => {
    if (needsSave(this.files) && !this.isCompiling) {
      saveAllAndAttemptCompiler(this.sessionName);
    }
  }

  @action fileExists = (name) => {
    return this.files.map((each) => each.name).indexOf(name) === -1;
  }
}

export default new App();