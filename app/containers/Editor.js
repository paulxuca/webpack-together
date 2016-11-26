import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';
import FileSelector from '../components/FileSelector';
import EditorComponent from '../components/EditorComponent';
import Preview from '../components/Preview';
import CreateFileModal from '../components/CreateFileModal';


const EditorMain = styled.default.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  overflow: hidden;
`;

const EditorWindow = styled.default.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

@inject('store') @observer
export default class Editor extends Component {
  render() {
    const {
      files,
      currentFileIndex,
      writeToFirebase,
      newFiletoFirebase,
    } = this.props.store.app;

    const { 
      addFileModalOpen,
      closeModal,
      openModal,
    } = this.props.store.editor;

    return (
      <EditorMain>
        <FileSelector />
        <CreateFileModal
          openModal={addFileModalOpen}
          closeModalFn={closeModal}
          newFileFn={newFiletoFirebase}
        />
        { files && <EditorWindow>
          <EditorComponent
            files={files}
            fileIndex={currentFileIndex}
            writeFirebase={writeToFirebase}
          />
          <Preview /> 
        </EditorWindow>}
      </EditorMain>
    );
  }
}