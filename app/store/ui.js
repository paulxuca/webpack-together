import { observable, action } from 'mobx';
import { getRequest } from '../utils/request';
const config = require('../config');

class UI {
  @observable addFileModalOpen;
  @observable sandboxSettingsModalOpen;
  @observable errorMessage;
  @observable packageList;
  @observable logMessages;
  @observable newLogs;

  constructor() {
    this.addFileModalOpen = false;
    this.sandboxSettingsModalOpen = false;
    this.newLogs = false;
  }

  @action getPackagesList = async (query) => {
    this.packageList = await getRequest(config.librariesio.apiUrl(query));
  }

  @action openSandboxModal = () => this.sandboxSettingsModalOpen = true;
  @action closeSandboxModal = () => this.sandboxSettingsModalOpen = false;
  @action closeFileModal = () => this.addFileModalOpen = false;
  @action openFileModal = () => this.addFileModalOpen = true;
  
  @action setErrorMessage = message => this.errorMessage = message;
  @action appendLogMessage = message => {
    this.logMessages.push(message);
    this.newLogs = true;
  }
  @action viewedLogs = () => this.newLogs = false;
}

export default new UI();