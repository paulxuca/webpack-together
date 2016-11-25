import { observable, action } from 'mobx';
import { getSession } from '../utils/sessions';
import { getRefByName, updateToFirebase } from '../utils/firebase';

class App {
  @observable sessionName;
  @observable firebaseRef;
  @observable files;
  @observable currentFileIndex = 0;
  @observable filesChanged = [];

  @action getSession = async() => {
    this.sessionName = await getSession();
    this.firebaseRef = getRefByName(this.sessionName);
    this.firebaseRef.on('value', this.sessionListener);
  }

  @action changeSelectedFileIndex = (index) => this.currentFileIndex = index;

  @action sessionListener = (snapshot) => {
    this.files = snapshot.val().files;
  }

  @action writeToFirebase = (fileIndex, value) => {
    updateToFirebase(this.sessionName, fileIndex, value);
  }
}

export default new App();