import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

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
`;

const FileSelectorList = styled.default.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
`;

const FileSelectorItem = styled.default.li`
  padding: 20px;
  min-width: 100px;
  background-color: ${props => props.isSelected ? '#EFF1F5' : '#DFE1E8'};
  color: ${props => props.isSelected ? '#3E444D' : '#6C7E8C'};
  display: inline;
  text-align: center;
  cursor: default;
  &:hover {
    color: #3E444D;
  }
`;

const NewFileSection = styled.default.div`
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewFileButton = styled.default.button`
  flex: 1;
  font-family: Avenir;
  padding-bottom: 0px;
  color: rgba(0, 0, 0, 0.8);
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

@inject('store') @observer
export default class FileSelector extends Component {
  render() {
    const { files, fileState, changeSelectedFileIndex, currentFileIndex, filesChanged } = this.props.store.app;
    const { openModal } = this.props.store.editor;

    return (
      <FileSelectorBar>
        <FileSelectorList>
          <NewFileSection>
            <NewFileButton onClick={() => openModal()}>New File</NewFileButton>
          </NewFileSection>
          {files && files.map((each, index) =>
            <FileSelectorItem
              key={`file_${index}`}
              onClick={() => changeSelectedFileIndex(index)}
              isSelected={currentFileIndex === index}
            >
                {each.name}
                <SavedIndicator isSaved={!files[index].isEdited} />
            </FileSelectorItem>
          )}
        </FileSelectorList>
      </FileSelectorBar>
    );
  }
}