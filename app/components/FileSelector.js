import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

const FileSelectorBar = styled.default.div`
  flex: 1;
  max-height: 40px;
  min-height: 40px;
  height: 40px;
  background: #232830;
  position: relative;
  font-size: 14px;
  font-family: Avenir, sans-serif;
  font-weight: 400;
`;

const FileSelectorList = styled.default.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  margin-left: 29px;
  align-items: center;
`;

const FileSelectorItem = styled.default.li`
  padding: 20px;
  min-width: 100px;
  background-color: ${props => props.isSelected ? '#2B303B' : '#232830'};
  color: ${props => props.isSelected ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  display: inline;
  text-align: center;
  &:hover {
    color: white;
  }
`;

@inject('store') @observer
export default class FileSelector extends Component {
  render() {
    const { files, fileState, changeSelectedFileIndex, currentFileIndex, filesChanged } = this.props.store.app;
    return (
      <FileSelectorBar>
        <FileSelectorList>
          {files && files.map((each, index) =>
            <FileSelectorItem
              key={`file_${index}`}
              onClick={() => changeSelectedFileIndex(index)}
              isSelected={currentFileIndex === index}
            >
                {each.name}
            </FileSelectorItem>
          )}
        </FileSelectorList>
      </FileSelectorBar>
    );
  }
}