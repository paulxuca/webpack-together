import 'codemirror/lib/codemirror.css';
import './codemirror.css';

import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import CodeMirror from 'codemirror';
import { observer, inject } from 'mobx-react';
import { getMode, setMode } from '../utils/editor';


const EditorComponentPane = styled.default.div`
  flex: 1;
  position: relative;
  display: flex;
  background-color: rgb(243, 245, 246);
  box-sizing: border-box;
  height: 100%;
  flex-direction: column;
`;

const EditorEntryFilePrompt = styled.default.div`
  min-height: 30px;
  background: white;
  font-family: Avenir;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  max-height: 30px;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #EEE;
  & span {
    padding: 20px;
  }
`;

const Editor = styled.default.div`
  display: block;
  flex: 1;
  position: relative;
`;

const initalState = {
  cursor: {
    ch: 0,
    line: 0,
  }
}

@observer
export default class EditorComponent extends Component {
  constructor() {
    super();
    this.changeCodeMirrorValueLight = this.changeCodeMirrorValueLight.bind(this);
    this.onCodeMirrorValueChange = this.onCodeMirrorValueChange.bind(this);
    this.recordCursorPosition = this.recordCursorPosition.bind(this);
    this.state = initalState;
  }

  componentDidMount() {
    const { files, fileIndex } = this.props;

    this.codemirror = CodeMirror(document.getElementById('codemirror'), {
      tabSize: 2,
      indentUnit: 2,
      lineNumbers: true,
      lineWrapping: true,
      value: files[fileIndex].content,
      matchTags: {
        bothTags: true,
      },
      autoCloseTags: true,
      mode: getMode(files[fileIndex].name),
      lint: false,
      theme: 'webpacktogether',
      scroll: false,
    });
    setMode(getMode(this.props.files[this.props.fileIndex].name), this.codemirror);
    this.codemirror.on('change', this.onCodeMirrorValueChange);
    // this.codemirror.on('change', this.recordCursorPosition);
  }

  componentWillReceiveProps(nextProps) {
    // this.codemirror.off('change', this.recordCursorPosition);    
    
    const nextFileContents = nextProps.files[nextProps.fileIndex].content;    
    this.changeCodeMirrorValueLight(nextFileContents);    
    
    if (nextProps.fileIndex !== this.props.fileIndex) {
      setMode(getMode(nextProps.files[nextProps.fileIndex].name), this.codemirror);
    } else {
      this.codemirror.setCursor(this.state.cursor);
    }
    // this.codemirror.on('change', this.recordCursorPosition);
  }

  changeCodeMirrorValueLight(value) {
    this.codemirror.setValue(value);
  }

  recordCursorPosition() {
    this.setState({
      cursor: this.codemirror.getCursor(),
    });
  }

  onCodeMirrorValueChange(instance, event) {
    this.props.writeFirebase(this.props.fileIndex, this.codemirror.getValue());
  }

  render() {
    return (
      <EditorComponentPane>
        {this.props.fileIsEntry ? <EditorEntryFilePrompt>
          <span>This file is an <b>entry file</b> for webpack.</span>
        </EditorEntryFilePrompt> : null}
        <Editor id="codemirror">
        </Editor>
      </EditorComponentPane>
    );
  }
}