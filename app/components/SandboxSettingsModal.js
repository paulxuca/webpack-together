import React from 'react';
import { inject, observer } from 'mobx-react';
import Modal from './Common/Modal';
import styled from 'styled-components';

import Loaders from './Loaders';


const ModalContainer = styled.default.div`
  height: 400px;
  display: flex;
  position: relative;
`;

const ModalSection = styled.default.div`
  flex: 1;
  flex-direction: column;
  max-width: 50%;
  min-width: 50%;
  padding: 15px;
  display: flex;
`

@inject('store') @observer
export default class SandboxSettingsModal extends React.Component {
  renderLoaderList() {
    let activeLoaders;
    const { webpackConfig } = this.props.store.app;
    const { loaderOptions } = this.props.store.editor;    

    if (webpackConfig) {
      activeLoaders = webpackConfig.loaders;
    }

    if (loaderOptions) {
      return (
        <Loaders
          activeLoaders={activeLoaders}
          loaderList={loaderOptions}
        />
      )
    }
    return null;
  }
  
  render() {
    const { closeSandboxModal, sandboxSettingsModalOpen } = this.props.store.ui;
    

    return (
      <Modal
        closeModalFn={closeSandboxModal}
        openModal={sandboxSettingsModalOpen}
        width={1000}
      >
        <ModalContainer>
          <ModalSection style={{ borderRight: '1px solid #DDD'}}>

          </ModalSection>
          <ModalSection>
            <h2>Loaders</h2>
            {this.renderLoaderList()}
          </ModalSection>
        </ModalContainer>
      </Modal>
    );
  }
}