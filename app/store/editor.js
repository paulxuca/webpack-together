import { observable, action } from 'mobx';

class Editor {
  @observable addFileModalOpen = false;
  @action closeModal = () => this.addFileModalOpen = false;
  @action openModal = () => this.addFileModalOpen = true;
}

export default new Editor();