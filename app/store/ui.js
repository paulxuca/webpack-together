import { observable, action } from 'mobx';
import { getRequest } from '../utils/request';
const config = require('../config');

class UI {
  @observable addFileModalOpen;
  @observable sandboxSettingsModalOpen;
  @observable errorMessage;
  @observable packageList;

  constructor() {
    this.addFileModalOpen = false;
    this.sandboxSettingsModalOpen = false;
  }

  @action getPackagesList = async (query) => {
    this.packageList = await getRequest(config.librariesio.apiUrl(query));
  }

  @action openSandboxModal = () => this.sandboxSettingsModalOpen = true;
  @action closeSandboxModal = () => this.sandboxSettingsModalOpen = false;
  @action closeFileModal = () => this.addFileModalOpen = false;
  @action openFileModal = () => this.addFileModalOpen = true;
  
  @action setErrorMessage = message => this.errorMessage = message;
}

export default new UI();