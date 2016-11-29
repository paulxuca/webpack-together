import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

const NetworkStatusBar = styled.default.div`
  width: 100%;
  height: 30px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  & span {
    font-size: 14px;
    font-family: Avenir;
    color: white;
    margin-left: 30px;
  }
`;

@inject('store') @observer
export default class NetworkStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onlineStatus: props.online
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  renderMessage() {
    if (!this.state.onlineStatus) {
      return "You've been disconnected. Your changes here may not save.";
    }
  }

  render() {
    const message = this.renderMessage();

    if (message) {
      return (
        <NetworkStatusBar>
          <span>{this.renderMessage()}</span>
        </NetworkStatusBar>
      );
    }
    return null;
  }
}
