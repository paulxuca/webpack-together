import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styled, { keyframes } from 'styled-components';
import { getEffect } from '../utils/style';

const popIn = getEffect('transform: translatey(200px)', 'transform: translatey(0px)');
const popOut = getEffect('transform: translatey(0px)', 'transform: translatey(200px)')

const ToastElement = styled.div`
  position: fixed;
  bottom: 0px;
  right: 0px;
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
  ${props => props.isActive ? `
    transform: translatey(0px);
    animation: ${popIn} 0.5s ease-in-out;
  `:
  `
    transform: translatey(200px);
    animation: ${popOut} 0.5s ease-in-out;
  `}
  
  >span {
    margin: 10px;
  }
`;


@inject('store') @observer
export default class Toasty extends Component {
  render() {
    const { toastMessage } = this.props.store.app;
    return (
      <ToastElement isActive={!!toastMessage}>
        <span>{toastMessage}</span>
      </ToastElement>
    );
  }
}