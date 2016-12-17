import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import Modal from './Common/Modal';
import { getMode } from '../utils/editor';

const ModalContainer = styled.div`
  padding: 30px;
  font-family: Avenir;
  font-weight: 400;
  font-size: 14px;
`;

const ModalInput = styled.input`
  background: white;
  border: 1px solid #EEE;
  width: 100%;
  font-family: Avenir;
  padding: 10px 20px;
  margin: 10px 0px;
  &:focus {
    outline: 0;
  }
`;

const ModalButton = styled.button`
  display: block;
  padding: 5px 20px;
  margin: 20px 0px 0px 0px;
  font-family: Avenir;
  font-weight: 500;
  border: 1px solid black;
  &:hover {
    transition: all 0.25s ease;
    color: white;
    background: black;
  }
  &:disabled {
    background-color: #DDD;
    color: #CCC;
    border-color: #CCC;
  }
`;

const ModalLabel = styled.label`
  margin-right: 10px;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const initalState = {
  fileName: '',
  isEntry: false,
};

@inject('store') @observer
export default class CreateFileModal extends Component {
  constructor() {
    super();
    this.state = initalState;
    this.onSubmit = this.onSubmit.bind(this);
    this.isButtonDisabled = this.isButtonDisabled.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { newFiletoFirebase } = this.props.store.app;
    const { closeModal } = this.props.store.editor;

    newFiletoFirebase(this.state.fileName, this.state.isEntry);
    this.props.store.ui.closeFileModal();
    this.setState(initalState);
  }

  isButtonDisabled() {
    if (!this.state.fileName || !getMode(this.state.fileName) || !this.props.store.app.fileExists(this.state.fileName)) {
      return true;
    }
    return false;
  }

  isCheckboxDisabled = () => {
    if (!this.state.fileName || ['jsx', 'text/typescript/, text/x-coffeescript'].indexOf(getMode(this.state.fileName)) === -1 ) {
      return true;
    }
    return false;
  }
  
  render() {
    const { closeFileModal, addFileModalOpen } = this.props.store.ui;

    return (
      <Modal
        closeModalFn={closeFileModal}
        openModal={addFileModalOpen}
      >
        <ModalContainer>
          <ModalTitle>Add new file</ModalTitle>
          <span>Include the file extension!</span>
          <form style={{ marginBottom: 0 }} onSubmit={this.onSubmit}>
            <ModalInput
              type="text"
              placeholder="File name"
              value={this.state.fileName}
              onChange={e => this.setState({ fileName: e.target.value })}
            />
            <ModalLabel htmlFor="isEntryCheckbox">Is the file an entry file for webpack?</ModalLabel>
            <input
              type="checkbox"
              name="isEntryCheckbox"
              value={this.state.isEntry}
              disabled={this.isCheckboxDisabled() &&  "true"}
              onChange={e => this.setState({ isEntry: e.target.value })}
            />
            <ModalButton type="submit" disabled={this.isButtonDisabled()}>Add</ModalButton>
          </form>
        </ModalContainer>
      </Modal>
    );
  }
}