import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const PreviewWindow = styled.default.div`
  flex: 1;
  position:${props => props.expanded ? 'absolute' : 'relative'};
  ${props => props.expanded && `
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 10;
    transition: all 0.25s ease;  
  `}
  border-left: 1px solid #EEE;
  > iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
`;

const PreviewWindowControls = styled.default.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
  margin: 10px;
`;

const PreviewButton = styled.default.button`
  color: #9b9b9b;
  font-size: 12px;
  float: right;
  font-weight: 500;
  border: 1px solid #C3C3C3;
  padding: 4px 8px;
  border-radius: 5px;
  &:hover {
    color: #222;
    border-color: #B8B8C2;
    background-color: #f5f5f5;
  }
  &:focus {
    outline: 0;
  }
`;

const getPreviewIframeSrc = () => ``;


@observer
export default class Preview extends Component {

  constructor() {
    super();
    this.iframeLoaded = false;
  }

  componentDidMount() {
    if (this.props.filesLoaded) {
      this.refreshIframe();
      this.iframeLoaded = true;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filesLoaded && !prevProps.isCompiling && !this.iframeLoaded) {
      this.refreshIframe();
    }
  }

  refreshIframe = () => {
    this.iframe.src = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/api/sandbox`;
  }

  render() {
    return (
      <PreviewWindow expanded={this.props.previewExpanded}>
        <iframe ref={(iframe) => this.iframe = iframe } />
        <PreviewWindowControls>
          <PreviewButton onClick={this.props.onToggleExpand}>{
            this.props.previewExpanded ? 'Close Preview' : 'Expand Preview'
          }</PreviewButton>
        </PreviewWindowControls>
      </PreviewWindow>
    );
  }
}