import { observable, action } from 'mobx';
import { getSession } from '../utils/sessions';
import {
  getRefByName,
  updateToFirebase,
  updateSessionData,
  createNewFile,
} from '../utils/firebase';

class App {
  @observable sessionName;
  @observable firebaseRef;
  @observable files;
  @observable currentFileIndex = 0;
  @observable filesKey = [];

  @action getSession = async() => {
    this.sessionName = await getSession();
    this.firebaseRef = getRefByName(this.sessionName);
    this.firebaseRef.on('value', this.sessionListener);
  }

  @action changeSelectedFileIndex = (index) => this.currentFileIndex = index;

  @action sessionListener = (snapshot) => {
    const currentValue = snapshot.val();
    this.files = Object.keys(currentValue.files).map((key) => {
      if (this.filesKey.indexOf(key) === -1) {
        this.filesKey.push(key);
      }
      return currentValue.files[key];
    });
  }

  @action writeToFirebase = (fileIndex, value) => {
    updateSessionData(this.sessionName);
    updateToFirebase(this.sessionName, this.filesKey[fileIndex], value);
  }

  @action newFiletoFirebase = (fileName, isEntry) => {
    updateSessionData(this.sessionName);
    createNewFile(this.sessionName, fileName, isEntry);
  }
}

export default new App();