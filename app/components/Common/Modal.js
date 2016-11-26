import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const ModalOverlay = styled.default.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: ${props => props.open ? 'flex' : 'none' };
  align-items: center;
  transition: all 0.25s;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  z-index: 10;
`;

const ModalContainer = styled.default.div`
  flex: 1;
  max-width: 500px;
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
    const { children, openModal } = this.props;

    return (
      <ModalOverlay open={openModal}>
        <ModalContainer innerRef={(modal) => { this.modal = modal; }}>
          {children}
        </ModalContainer>
      </ModalOverlay>
    );
  }
}