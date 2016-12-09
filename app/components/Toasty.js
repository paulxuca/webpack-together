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
  z-index: 10;
  background-color: black;
  min-width: 200px;
  min-height: 50px;
  margin: 20px;
  color: white;
  font-family: Avenir;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  animation: ${popIn} 0.5s ease-in-out;
  >span {
    margin: 10px;
  }
`;


@inject('store') @observer
export default class Toasty extends Component {
  render() {
    const { toastMessage } = this.props.store.app;

    if (toastMessage) {
      return (
        <ToastElement>
          <span>{toastMessage}</span>
        </ToastElement>
      );
    }
    return null;
  }
}