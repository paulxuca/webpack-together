import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { debounce } from 'react-decoration';
import styled from 'styled-components';

const NpmSearchbar = styled.input`
  font-size: 13px;
  width: 100%;
  border: 1px solid #ccc;
  line-height: 17px;
  min-height: 30px;
  padding: 0px 6px;
  border-radius: 3px;
  &:focus {
    box-shadow: 0px 0px 3px 0px #a2d7ff;
    outline: 0;
  }
`;

const NpmPackageList = styled.ul`
  margin: 0;
  padding: 0;
`;

const NpmPackageItem = styled.li`
  list-style:none;
  ${props => !props.isEnabled && `
    opacity: 0.3;  
  `}
  p {
    font-weight: 500;
    font-size: 14px;
    margin: 0px;
    padding: 10px 0px;
  }
  span {
    font-weight: 300;
    font-size: 13px;
  }
  &:hover {
    opacity: 1;
  }
`;

const NpmPackage = styled.div`
  overflow: scroll;
  position: relative;
`;

export default class Npm extends Component {
  constructor(props) {
    super();
    this.searchNpm = this.searchNpm.bind(this);
    this.handleClickPackage = this.handleClickPackage.bind(this);
    this.state = {
      searchQuery: '',
      loadedPackages: props.activePackages,
    };
  }
  
  @debounce(500)
  searchNpm() {
    this.props.queryNpm(this.state.searchQuery)
  }

  isPackageActive(packageName) {
    return this.state.loadedPackages.indexOf(packageName) !== -1;
  }

  handleClickPackage(packageName) {
    let newPackageList;
    if (this.state.loadedPackages.indexOf(packageName) !== -1) {
      newPackageList = this.state.loadedPackages.filter(e => e !== packageName);
    } else {
      newPackageList = this.state.loadedPackages.concat(packageName);
    }
    this.setState({
      loadedPackages: newPackageList,
    });
  }

  componentWillUnmount() {
    this.props.onUnmount(this.state.loadedPackages);
  }

  render() {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <NpmSearchbar
          type="text"
          placeholder="Search NPM for packages"
          onChange={(e) => {
            this.setState({ searchQuery: e.target.value });
            this.searchNpm();
          }}
          value={this.state.searchQuery}
        />
        <NpmPackage>
          <NpmPackageList>
            {this.props.npmList && this.props.npmList.map((each) => {
              return (
                <NpmPackageItem
                  key={each.name}
                  onClick={() => this.handleClickPackage(each.name)}
                  isEnabled={this.isPackageActive(each.name)}
                >
                  <p>{each.name}</p>
                  <span>{each.description}</span>
                </NpmPackageItem>
              );
            })}
          </NpmPackageList>
        </NpmPackage>
      </div>
    );
  }
}