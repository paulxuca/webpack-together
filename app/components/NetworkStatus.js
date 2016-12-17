import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Icon from './Common/Icon';
import { getEffect } from '../utils/style';
import styled from 'styled-components';

const popIn = getEffect('height: 0px', 'height: 30px');
const popOut = getEffect('height: 30px', 'height: 0px');

const NetworkStatusBar = styled.div`
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
    if (!this.props.store.editor.onlineStatus) {
      return "You've been disconnected from the internet! Your changes here may not save.";
    }
  }

  render() {
    const message = this.renderMessage();

    return (
      <NetworkStatusBar
        isActive={!this.props.store.editor.onlineStatus}
      >
        <Icon
          type="bolt-alt"
          color="white"
        />
        <span>{message}</span>
      </NetworkStatusBar>
    );
  }
}
