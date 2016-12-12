import { observable, action } from 'mobx';
import { getRequest } from '../utils/request';

class Editor {
  @observable onlineStatus;

  constructor() {
    this.addFileModalOpen = false;
    this.sandboxSettingsModalOpen = false;
    this.onlineStatus = navigator.onLine;
  }

  @action onlineListener = (e) => {
    this.onlineStatus = navigator.onLine;
  }

  @action getLoaderOptions = async () => {
    this.loaderOptions = await getRequest('/api/loaders');
  }
}

export default new Editor();