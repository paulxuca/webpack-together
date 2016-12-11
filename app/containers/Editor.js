import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';

import FileSelector from '../components/FileSelector';
import EditorComponent from '../components/EditorComponent';
import Preview from '../components/Preview';
import CreateFileModal from '../components/CreateFileModal';
import SandboxSettingsModal from '../components/SandboxSettingsModal';
import Toasty from '../components/Toasty';
import NetworkStatus from '../components/NetworkStatus';
import { EditorMain, EditorWindow } from '../components/Editor';

@inject('store') @observer
export default class Editor extends Component {
  constructor() {
    super();
    this.state = {
      previewExpanded: false,
    }
    this.handleIframeMessage = this.handleIframeMessage.bind(this);
    this.handleSaveShortcut = this.handleSaveShortcut.bind(this);
  }

  componentDidMount() {
    this.props.store.editor.getLoaderOptions();

    window.addEventListener('message', this.handleIframeMessage);
    window.addEventListener('keydown', this.handleSaveShortcut);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleIframeMessage);
    window.removeEventListener('keydown', this.handleSaveShortcut);
  }

  handleIframeMessage(e) {
    if (e.data.errorMessage) {
      this.props.store.editor.setErrorMessage(e.data.errorMessage);  
    }
  }

  handleSaveShortcut(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
      event.preventDefault();
      this.props.store.app.saveFirebase();
    }
  }

  render() {
    const {
      files,
      changeSelectedFileIndex,
      deleteFileToFirebase,

      currentFileIndex,
      writeToFirebase,
      newFiletoFirebase,
      entryFileName,
      isCompiling,
      fileExists,
    } = this.props.store.app;

    const { 
      addFileModalOpen,
      closeModal,
      openModal,
      onlineStatus,

      openSandboxModal,
      closeSandboxModal,
      sandboxSettingsModalOpen,
      errorMessage,
      setErrorMessage,

      loaders,
    } = this.props.store.editor;

    return (
      <EditorMain>
        <NetworkStatus online={onlineStatus} />
        <FileSelector
          files={files}
          currentIndex={currentFileIndex}
          changeIndex={changeSelectedFileIndex}
          deleteFromFirebase={deleteFileToFirebase}
          openCreateModal={openModal}
          openSandboxModal={openSandboxModal}
          isOnline={onlineStatus}
        />
        <CreateFileModal
          openModal={addFileModalOpen}
          closeModalFn={closeModal}
          newFileFn={newFiletoFirebase}
          fileExists={fileExists}
        />
        <SandboxSettingsModal
          openModal={sandboxSettingsModalOpen}
          closeModalFn={closeSandboxModal}
          loaders={loaders}
        />
        { files && <EditorWindow>
          <EditorComponent
            files={files}
            fileIndex={currentFileIndex}
            fileIsEntry={files[currentFileIndex].name === entryFileName}
            writeFirebase={writeToFirebase}
            isOnline={onlineStatus}
          />
          <Preview
            isCompiling={isCompiling}
            filesLoaded={!!files}
            error={errorMessage}
            setError={setErrorMessage}
            onToggleExpand={() => this.setState({ previewExpanded: !this.state.previewExpanded })}
            previewExpanded={this.state.previewExpanded}
          /> 
        </EditorWindow>}
        <Toasty />
      </EditorMain>
    );
  }
}