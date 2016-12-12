import { observable, action } from 'mobx';

class UI {
  @observable addFileModalOpen;
  @observable sandboxSettingsModalOpen;
  @observable errorMessage;

  constructor() {
    this.addFileModalOpen = false;
    this.sandboxSettingsModalOpen = false;
  }

  @action openSandboxModal = () => this.sandboxSettingsModalOpen = true;
  @action closeSandboxModal = () => this.sandboxSettingsModalOpen = false;
  @action closeFileModal = () => this.addFileModalOpen = false;
  @action openFileModal = () => this.addFileModalOpen = true;
  
  @action setErrorMessage = message => this.errorMessage = message;
}

export default new UI();