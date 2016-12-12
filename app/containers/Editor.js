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
    this.handleSandboxSettingsModalUnmount = this.handleSandboxSettingsModalUnmount.bind(this);
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
      this.props.store.ui.setErrorMessage(e.data.errorMessage);  
    }
  }

  handleSaveShortcut(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
      event.preventDefault();
      this.props.store.app.saveFirebase();
    }
  }

  handleSandboxSettingsModalUnmount(activeLoaders) {
    this.props.store.app.changeLoaders(activeLoaders);
  }

  render() {
    const {
      files,
      isCompiling,
      currentFileIndex,
      entryFileName,
      writeToFirebase,
    } = this.props.store.app;

    const { 
      onlineStatus,
    } = this.props.store.editor;

    const {
      setErrorMessage,
      errorMessage,
    } = this.props.store.ui;

    return (
      <EditorMain>
        <NetworkStatus online={onlineStatus} />
        <FileSelector />
        <CreateFileModal />
        <SandboxSettingsModal handleClose={this.handleSandboxSettingsModalUnmount}/>
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