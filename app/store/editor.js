import { observable, action } from 'mobx';

class Editor {
  @observable addFileModalOpen = false;
  @observable sandboxSettingsModalOpen = false;
  @observable onlineStatus = navigator.onLine;

  @action openSandboxModal = () => this.sandboxSettingsModalOpen = true;
  @action closeSandboxModal = () => this.sandboxSettingsModalOpen = false;
  @action closeModal = () => this.addFileModalOpen = false;
  @action openModal = () => this.addFileModalOpen = true;
}

export default new Editor();