import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const PreviewWindow = styled.default.div`
  flex: 1;
  position: relative;
  > iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
`;

const getPreviewIframeSrc = () => ``;


@observer
export default class Preview extends Component {

  componentDidMount() {
    if (this.props.filesLoaded) {
      this.refreshIframe();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filesLoaded && !prevProps.isCompiling) {
      this.refreshIframe();
    }
  }

  refreshIframe = () => {
    this.iframe.src = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/api/sandbox`;
  }

  render() {
    return (
      <PreviewWindow>
        <iframe ref={(iframe) => this.iframe = iframe } />
      </PreviewWindow>
    );
  }
}