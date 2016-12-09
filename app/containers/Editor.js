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
    this.handleSaveShortcut = this.handleSaveShortcut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleSaveShortcut);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleSaveShortcut);
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
    } = this.props.store.editor;

    return (
      <EditorMain>
        <NetworkStatus online={onlineStatus} />
        <FileSelector />
        <CreateFileModal
          openModal={addFileModalOpen}
          closeModalFn={closeModal}
          newFileFn={newFiletoFirebase}
          fileExists={fileExists}
        />
        <SandboxSettingsModal
          openModal={sandboxSettingsModalOpen}
          closeModalFn={closeSandboxModal}
        />
        { files && <EditorWindow>
          <EditorComponent
            files={files}
            fileIndex={currentFileIndex}
            fileIsEntry={files[currentFileIndex].name === entryFileName}
            writeFirebase={writeToFirebase}
          />
          <Preview
            isCompiling={isCompiling}
            filesLoaded={!!files}
            onToggleExpand={() => this.setState({ previewExpanded: !this.state.previewExpanded })}
            previewExpanded={this.state.previewExpanded}
          /> 
        </EditorWindow>}
        <Toasty />
      </EditorMain>
    );
  }
}