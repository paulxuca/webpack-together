import React, { Component } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

const getUserShortname = (userName) => {
  if (!userName) return null;
  return userName.split('-').map(e => e.substring(0, 1)).join('');
}

const UsersBar = styled.div`
  width: 50%;
  position: absolute;
  z-index: 5;
  bottom: 0;
  height: 40px;
  background-color: rgb(223, 225, 232);
`;

const UsersList = styled.ul`
  > li {
    list-style: none;
  }
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

const UserElement = styled.li`
  display: inline-block;
  width: 40px;
  height: 40px;
  background-color: ${props => props.color};
  >span {
    color: white;
    text-transform: uppercase;
    font-weight: 400;
    font-size: 12px;
    position: relative;
    left: 12px;
    top: 12px;
    letter-spacing: 1px;
  }
`;

@observer
class UsersDisplay extends Component {
  render() {
    const { users } = this.props;
    return (
      <UsersBar>
        <UsersList>
          {users && Object.keys(users).map(e => {
            return users[e].userColor && (
              <UserElement
                color={users[e].userColor}
                key={e}
              >
                <span>{getUserShortname(users[e].userName)}</span>
              </UserElement>
            )
          })}
        </UsersList>
      </UsersBar>
    );
  }
}

export default UsersDisplay;