import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';

import FileSelector from '../components/FileSelector';
import EditorComponent from '../components/EditorComponent';
import Preview from '../components/Preview';
import CreateFileModal from '../components/CreateFileModal';
import SandboxSettingsModal from '../components/SandboxSettingsModal';
import Toasty from '../components/Toasty';
import NetworkStatus from '../components/NetworkStatus';
import UsersDisplay from '../components/UsersDisplay';
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
    this.handleLoaderUnmount = this.handleLoaderUnmount.bind(this);
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
    if (e.data.type === 'error') {
      this.props.store.ui.setErrorMessage(e.data.errorMessage);  
    } else if (e.data.type === 'log') {
      
    }
  }

  handleSaveShortcut(event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 83) {
      event.preventDefault();
      this.props.store.app.saveFirebase();
    }
  }

  handleLoaderUnmount(newActiveLoaders) {
    this.props.store.app.changeLoaders(newActiveLoaders);
  }

  render() {
    const {
      files,
      users,
      isCompiling,
      currentFileIndex,
      entryFileName,
      writeToFirebase,
      updatePublicCursorPosition,

      userID
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
        <SandboxSettingsModal
          handleLoaderClose={this.handleLoaderUnmount}
          handlePackageClose={this.handlePackagesUnmount}
        />
        { files && <EditorWindow>
          <EditorComponent
            files={files}
            fileIndex={currentFileIndex}
            fileIsEntry={files[currentFileIndex].name === entryFileName}
            writeFirebase={writeToFirebase}
            isOnline={onlineStatus}
            publicUsers={users}
            selfID={userID}
            changeCursorPosition={updatePublicCursorPosition}
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
        <UsersDisplay
          users={users}
        />
        <Toasty />
      </EditorMain>
    );
  }
}