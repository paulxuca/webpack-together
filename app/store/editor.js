import { observable, action } from 'mobx';

class Editor {
  @observable addFileModalOpen = false;
  @action closeModal = () => this.addFileModalOpen = false;
  @action openModal = () => this.addFileModalOpen = true;
  @observable onlineStatus = navigator.onLine;
}

export default new Editor();