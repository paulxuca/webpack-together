// import 'codemirror/lib/codemirror.css';
import './ace.css';
require('brace/theme/tomorrow');

import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import ace from 'brace';
import { observer } from 'mobx-react';
import { getMode } from '../utils/editor';
import {
  Editor,
  EditorComponentPane,
  EditorEntryFilePrompt
} from './Editor';


const initalState = {
  cursor: {
    column: 0,
    row: 0,
  }
}

@observer
export default class EditorComponent extends Component {
    constructor() {
      super();
      this.state = initalState;
      this.handleCursorPositionChange = this.handleCursorPositionChange.bind(this);
      this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    componentDidMount() {
      const { files, fileIndex } = this.props;
      
      this.editor = ace.edit('aceeditor');
      this.editor.setTheme('ace/theme/tomorrow');
      this.editor.$blockScrolling = window.Infinity;
      this.editor.setShowPrintMargin(false);
      this.editor.setValue(files[fileIndex].content);
      this.editor.getSession().setUseWrapMode(true);
      this.editor.getSession().setOptions({
        tabSize: 2,
        useSoftTabs: true,
      });
      this.editor.getSession().on('change', this.handleEditorChange);
      this.editor.getSession().selection.on('changeCursor', this.handleCursorPositionChange);
      this.editor.getSession().on('paste', this.handleCursorPositionChange);
      this.editor.clearSelection();
      getMode(files[fileIndex].name, this.editor);      
    }

    componentWillReceiveProps(nextProps) {
      this.editor.getSession().off('change', this.handleEditorChange)
      const nextFile = nextProps.files[nextProps.fileIndex];    
      this.editor.setValue(nextFile.content);

      if (!nextProps.isOnline) {
        this.editor.setReadOnly(true);
      } else {
        this.editor.setReadOnly(false);
      }

      if (nextProps.fileIndex !== this.props.fileIndex) {
        
        getMode(nextFile.name, this.editor);
      } else {
        this.editor.moveCursorTo(this.state.cursor.row, this.state.cursor.column);
      }
      
      this.editor.clearSelection();      
      this.editor.getSession().on('change', this.handleEditorChange);
    }

    handleEditorChange(e) {
      this.props.writeFirebase(this.props.fileIndex, this.editor.getValue());
    }

    handleCursorPositionChange(e) {
      this.setState({
        cursor: this.editor.getCursorPosition(),
      });
    }

  render() {
    return (
      <EditorComponentPane>
        {this.props.fileIsEntry ? <EditorEntryFilePrompt>
          <span>This file is an <b>entry file</b> for webpack.</span>
        </EditorEntryFilePrompt> : null}
        <Editor id="aceeditor">
        </Editor>
      </EditorComponentPane>
    );
  }
}