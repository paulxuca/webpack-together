// import 'codemirror/lib/codemirror.css';
import './ace.css';
require('brace/theme/tomorrow');
require('brace/ext/language_tools.js');

import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import ace from 'brace';
import { observer } from 'mobx-react';
import isEqualObject from 'lodash/isEqual';
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
};

const Selection = ace.acequire('ace/selection').Selection;
const Range = ace.acequire('ace/range').Range;

const userPointers = {};

const hasSelection = (start, end) => {
  if (end.row !== start.row || end.column !== start.column) {
    return true;
  }
  return false;
};

const isUsersEqual = (currentUsers, nextUsers) => {
  return isEqualObject(currentUsers, nextUsers);
};

const getRangeFromPosition = (position) => {
  const { start, end } = position;
  return new Range(start.row, start.column, end.row, end.column);
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
    window.addEventListener('keydown', this.handleMetaKeyPress);
    ace.acequire('ace/ext/language_tools');
    
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
    this.editor.getSession().on('paste', this.handleCursorPositionChange);      
    this.editor.getSession().selection.on('changeCursor', this.handleCursorPositionChange);

    this.editor.clearSelection();
    // this.editor.commands.bindKey('Cmd-Z', null);

    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: false
    });

    getMode(files[fileIndex].name, this.editor);      
  }

  componentWillReceiveProps(nextProps) {
    this.editor.getSession().off('change', this.handleEditorChange)
    const nextFile = nextProps.files[nextProps.fileIndex];    
    
    if (nextFile.content !== this.editor.getValue()) {
      this.editor.setValue(nextFile.content);
      this.editor.clearSelection();
    }
    
    if (!nextProps.isOnline) {
      this.editor.setReadOnly(true);
    } else {
      this.editor.setReadOnly(false);
    }

    if (nextProps.fileIndex !== this.props.fileIndex) {
      getMode(nextFile.name, this.editor);
      this.editor.clearSelection();
    }

    nextProps.publicUsers && Object.keys(nextProps.publicUsers)
    .filter((e) => {
      // return this.props.selfID !== e;
      return true;
    })
    .forEach(eachUser => {
      const user = nextProps.publicUsers[eachUser];
    
      if (user.isRange) {
        this.editor.getSession().addMarker(getRangeFromPosition(user.position), 'ace_active-line', 'line', false);
        // userPointers[user.userID].addRange(getRangeFromPosition(user.position));
      } else {

      }
    });
    
    this.editor.getSession().on('change', this.handleEditorChange);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.cursor.row !== this.state.cursor.row && nextState.cursor.column !== this.state.cursor.column) {
      this.editor.moveCursorTo(nextState.cursor.row, nextState.cursor.column);
    }
  }

  handleMetaKeyPress = (e) => {
    // if ((e.metaKey || e.ctrlKey) && e.keyCode === 90) {
    //   e.preventDefault();
    //   this.editor.getSession().getUndoManager().undo(true);
    // }
  }

  handleEditorChange(e) {
    this.props.writeFirebase(this.props.fileIndex, this.editor.getValue());
  }

  handleCursorPositionChange(e) {
    const cursorPosition = this.editor.getCursorPosition();
    const { start, end } = this.editor.selection.getRange();      

    this.setState({
      cursor: cursorPosition,
    });

    if (hasSelection(start, end)) {
      this.props.changeCursorPosition(true, { start, end });
    } else {
      this.props.changeCursorPosition(false, cursorPosition);
    }
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