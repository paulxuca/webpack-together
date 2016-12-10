import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Icon from './Common/Icon';
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  from {
    height: 0px;
  }
  to {
    height: 30px;
  }
`;

const popOut = keyframes`
  from {
    height: 30px;
  }
  to {
    height: 0px;
  }
`;

const NetworkStatusBar = styled.default.div`
  width: 100%;
  height: 30px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  ${props => props.isActive ?
    ` height: 30px;
      animation: ${popIn} 0.5s ease-in-out;`
    :`height: 0px;
      animation: ${popOut} 0.5s ease;`
  }
  & span {
    font-size: 14px;
    font-family: Avenir;
    color: white;
    margin-left: 10px;
  }
`;

@inject('store') @observer
export default class NetworkStatus extends Component {
  renderMessage() {
    if (!this.props.online) {
      return "You've been disconnected from the internet! Your changes here may not save.";
    }
  }

  render() {
    const message = this.renderMessage();

    return (
      <NetworkStatusBar isActive={!!message}>
        <Icon
          type="bolt-alt"
          color="white"
        />
        <span>{message}</span>
      </NetworkStatusBar>
    );
  }
}
