import { observable, action, toJS } from 'mobx';
import difference from 'lodash/difference';
import {
  getSession,
  saveAllAndAttemptCompiler,
  createNewFile,
  deleteFile,
  needsSave,
  getUserID,
} from '../utils/sessions';
import {
  getRefByName,
  updateToFirebase,
  updateSessionData,
  changeSessionLoaders,
  changeSessionPackages,
} from '../utils/firebase';

const delay = (timeout) => new Promise(resolve => setTimeout(() => resolve(), timeout));

const debounce = (func, wait, immediate) => {
	let timeout;
	return function() {
		let context = this;
    let args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

class App {
  @observable sessionName;
  @observable webpackConfig;
  @observable packagesConfig;
  @observable firebaseRef;
  @observable files;
  @observable currentFileIndex;
  @observable filesKey;
  @observable entryFileName;
  @observable isCompiling;
  @observable toastMessage;
  @observable canChangeIndex;
  @observable users;

  constructor() {
    this.currentFileIndex = 0;
    this.filesKey = [];
    this.canChangeIndex = true;
    this.saveFirebase = debounce(this.saveFirebase, 300);
    this.updatePublicCursorPosition = debounce(this.updatePublicCursorPosition, 100);
  }

  @action getSession = async () => {
    const { sessionName, error } = await getSession();
    if (error) this.displayToast('An Error occured when initalizing the sandbox. Reload the page or try again later!', 5000);
    
    this.userID = getUserID();
    this.sessionName = sessionName;
    this.firebaseRef = getRefByName(this.sessionName);      
    this.firebaseRef.on('value', this.sessionListener);
    this.firebaseRef.on('child_changed', this.childListener);
  }

  @action changeSelectedFileIndex = (index) => this.currentFileIndex = index;

  childListener = (snapshot) => {
    this.filesKey = Object.keys(snapshot.val()).map((ea) => {
      return snapshot.val()[ea];
    });
  }

  sessionListener = (snapshot) => {
    const currentValue = snapshot.val();

    this.entryFileName = currentValue.entryFile;
    this.webpackConfig = currentValue.webpack;
    this.packagesConfig = currentValue.packages;
    this.users = currentValue.users;

    this.files = Object.keys(currentValue.files).map((key) => {
      if (this.filesKey.indexOf(key) === -1) {
        this.filesKey.push(key);
      }
      return currentValue.files[key];
    });

    if (currentValue.isCompiling) {
      this.displayToast('Recompiling in progress!');
    } else if (this.isCompiling && !currentValue.isCompiling) {
      this.toastMessage = false;
    }

    this.isCompiling = currentValue.isCompiling;        
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
    if (this.entryFileName == this.files[fileIndex].name) {
      this.displayToast('Must have a webpack entry file!', 1000);
    } else {
      if (this.currentFileIndex == fileIndex) {
        this.changeSelectedFileIndex(fileIndex - 1 >= 0 ? fileIndex - 1 : 0);
      }
      updateSessionData(this.firebaseRef);
      deleteFile(this.sessionName, this.filesKey[fileIndex]);
    }
  }

  @action saveFirebase = (override = false) => {
    if ((needsSave(this.files) && !this.isCompiling) || override) {
      saveAllAndAttemptCompiler(this.sessionName);
    }
  }

  @action updatePublicCursorPosition = (isRange, position) => {
    this.firebaseRef.child(`users/${this.userID}`).set({
      isRange,
      position,
    });
  }

  @action changeLoaders = (newLoaders) => {
    // if (newLoaders)
    if (difference(newLoaders, toJS(this.webpackConfig.loaders)).length > 0) {
      changeSessionLoaders(this.firebaseRef, newLoaders);
      this.saveFirebase(true);
    }
  }

  @action fileExists = (name) => {
    return this.files.map((each) => each.name).indexOf(name) === -1;
  }

  @action displayToast = async (message, delayTime) => {
    this.toastMessage = message;
    if (delayTime) {
      await delay(delayTime);
      this.toastMessage = false;
    }
  }
}

export default new App();