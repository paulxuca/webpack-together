import React from 'react';
import { observer } from 'mobx-react';
import Modal from './Common/Modal';
import styled from 'styled-components';

const ModalContainer = styled.default.div`
  min-height: 400px;
  display: flex;
  div:first-of-type {
    border-right: 1px solid #DDD;
  }
`;

const ModalSection = styled.default.div`
  flex: 1;
  max-width: 50%;
  min-width: 50%;
  padding: 15px;
`

@observer
export default class SandboxSettingsModal extends React.Component {
  componentDidMount() {
    this.props.reqLoaderOptions();
  }
  
  render() {
    return (
      <Modal
        closeModalFn={this.props.closeModalFn}
        openModal={this.props.openModal}
        width={1000}
      >
        <ModalContainer>
          <ModalSection>

          </ModalSection>
          <ModalSection>
            <h2>Loaders</h2>
          </ModalSection>
        </ModalContainer>
      </Modal>
    );
  }
}