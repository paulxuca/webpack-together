import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import Icon from './Common/Icon';

const FileSelectorBar = styled.default.div`
  flex: 1;
  max-height: 40px;
  min-height: 40px;
  height: 40px;
  background: #DFE1E8;
  position: relative;
  font-size: 14px;
  font-family: Avenir, sans-serif;
  font-weight: 400;
  overflow: hidden;
  display: flex;
`;

const FileSelectorList = styled.default.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: scroll;
  flex: 4;
`;

const FileSelectorItem = styled.default.li`
  min-width: 120px;
  padding: 20px 0px;
  background-color: ${props => props.isSelected ? '#EFF1F5' : '#DFE1E8'};
  color: ${props => props.isSelected ? '#3E444D' : '#6C7E8C'};
  display: inline;
  text-align: center;
  cursor: default;
  &:hover {
    color: #3E444D;
    >button {
      display: inline;
    }
  }
`;

const NewFileSection = styled.default.div`
  width: 250px;
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #DFE1E8;
`;

const FileButton = styled.default.button`
  flex: 1;
  font-family: Avenir;
  padding-bottom: 0px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  @media (max-width: 800px) {
    >span {
      display: none;
    }
  }
  &:disabled {
    color: #C2C2C2;
  }
  &:focus {
    outline: 0;
  }
  &:hover {
    color: black;
    transition: 0.25s ease;  
  }
`;

const SavedIndicator = styled.default.div`
  height: 5px
  width: 5px;
  position: relative;
  bottom: 2px;
  border-radius: 100%;
  background-color: #bf616a;
  display: ${props => props.isSaved ? 'none' : 'inline-block'};
  margin-left: 5px;
`;

const DeleteButton = styled.default.button`
  display: none;
  padding: 0;
`;

@inject('store') @observer
export default class FileSelector extends Component {
  render() {
    const { files, changeSelectedFileIndex, currentFileIndex, deleteFileToFirebase } = this.props.store.app;
    const { onlineStatus } = this.props.store.editor;
    const { openFileModal, openSandboxModal } = this.props.store.ui;

    return (
      <FileSelectorBar>
        <FileSelectorList>
          {files && files.map((each, index) =>
            <FileSelectorItem
              key={`file_${index}`}
              isSelected={currentFileIndex === index}
            >
                <span onClick={(e) => changeSelectedFileIndex(index)}>{each.name}</span>
                <SavedIndicator isSaved={!files[index].isEdited} />
                <DeleteButton
                  onClick={() => deleteFileToFirebase(index)}
                >
                  <Icon
                    type="close"
                    size={10}
                    style={{
                      marginLeft: 5,
                    }}
                  />
                </DeleteButton>
            </FileSelectorItem>
          )}
        </FileSelectorList>
          <NewFileSection>
            <FileButton
              onClick={() => openFileModal()}
              disabled={!onlineStatus}
            >
              <Icon
                type="file"
                style={{ marginRight: 5 }}
                size={10}
              />
              <span>New File</span>
            </FileButton>
            <FileButton
              onClick={() => openSandboxModal()}
              disabled={!onlineStatus}
            >
              <Icon
                type="settings"
                style={{ marginRight: 5 }}
                size={10}
              />
              <span>Sandbox Settings</span>
          </FileButton>
        </NewFileSection>
      </FileSelectorBar>
    );
  }
}