import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  from {
    transform: translatey(1000px);
  }

  to {
    transform: translatey(0px);
  }
`;

const ModalOverlay = styled.div`
  width: 100%;
  font-family: Avenir;
  height: 100%;
  position: absolute;
  display: ${props => props.open ? 'flex' : 'none' };
  align-items: center;
  transition: all 0.25s;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  z-index: 10;
`;

const ModalContainer = styled.div`
  flex: 1;
  animation: ${popIn} 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  @media (min-width: 1000px) {
    max-width: ${props => props.width || 500}px;
  }
  @media (max-width: 999px) {
    max-width: 500px;
  }
  background: #EFF1F5;
`;

@observer
export default class Modal extends Component {
  constructor() {
    super();
    this.onClickOverlay = this.onClickOverlay.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.onClickOverlay);
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onClickOverlay);
    window.addEventListener('keydown', this.onKeyDown);
  }
  
  onClickOverlay(e) {
    if (this.props.openModal && this.modal && !this.modal.contains(e.target)) {
      this.props.closeModalFn();
    }
  }

  onKeyDown(e) {
    if (this.props.openModal && e.keyCode === 27) {
      this.props.closeModalFn()
    }
  }

  render() {
    const { children, openModal, width, style } = this.props;

    return (
      <ModalOverlay open={openModal}>
        <ModalContainer
          width={width}
          innerRef={(modal) => { this.modal = modal; }}
        >
          {children}
        </ModalContainer>
      </ModalOverlay>
    );
  }
}