import { observable, action } from 'mobx';
import { getRequest } from '../utils/request';

class Editor {
  @observable addFileModalOpen = false;
  @observable sandboxSettingsModalOpen = false;
  @observable onlineStatus = navigator.onLine;
  @observable errorMessage;

  @action onlineListener = (e) => {
    this.onlineStatus = navigator.onLine;
  }

  @action getLoaderOptions = async () => {
    this.loaders = await getRequest('/api/loaders').data;
  }

  @action setErrorMessage = (message) => this.errorMessage = message;
  @action openSandboxModal = () => this.sandboxSettingsModalOpen = true;
  @action closeSandboxModal = () => this.sandboxSettingsModalOpen = false;
  @action closeModal = () => this.addFileModalOpen = false;
  @action openModal = () => this.addFileModalOpen = true;
}

export default new Editor();