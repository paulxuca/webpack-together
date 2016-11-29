import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  from { 
    transform: translatey(100px);
  }

  to {
    transform: translatey(0px);
  }
`;

const ToastElement = styled.default.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: black;
  min-width: 200px;
  min-height: 50px;
  z-index: 3;
  margin: 20px;
  color: white;
  font-family: Avenir;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  animation: ${popIn} 0.5s ease-in-out;
`;


@inject('store') @observer
export default class Toasty extends Component {
  renderMessage() {
    const { isCompiling } = this.props.store.app;

    if (isCompiling) {
      return 'Recompiling in progress!';
    }
    return false;
  }

  render() {
    const toastMessage = this.renderMessage();

    if (toastMessage) {
      return (
        <ToastElement>
          {toastMessage}
        </ToastElement>
      );
    }
    return null;
  }
}