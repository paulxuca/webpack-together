import React from 'react';
import Modal from './Common/Modal';
import styled from 'styled-components';

const ModalContainer = styled.default.div`
  padding: 30px;
`;


export default class SandboxSettingsModal extends React.Component {
  render() {
    return (
      <Modal
        closeModalFn={this.props.closeModalFn}
        openModal={this.props.openModal}
        width={1000}
      >
        <ModalContainer>

        </ModalContainer>
      </Modal>
    );
  }
}