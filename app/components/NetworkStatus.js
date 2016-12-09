import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Icon from './Common/Icon';
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
    margin-left: 10px;
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
      return "You've been disconnected from the internet! Your changes here may not save.";
    }
  }

  render() {
    const message = this.renderMessage();

    if (message) {
      return (
        <NetworkStatusBar>
          <Icon
            type="bolt-alt"
            color="white"
          />
          <span>{this.renderMessage()}</span>
        </NetworkStatusBar>
      );
    }
    return null;
  }
}
