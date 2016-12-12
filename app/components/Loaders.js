import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const LoadersContainer = styled.default.div`
  flex: 1;
  overflow: scroll;
  border: 0;
`;

const LoaderText = styled.default.span`
  font-size: ${props => props.size}px;
  font-weight: ${props => props.weight};
  ${props => props.block && `
    display: block;
  `}
`;

const LoaderOptionSection = styled.default.div`
  margin: 10px 0px;
`;

const LoaderOptions = styled.default.div`
  ${props => props.isDisabled && `
    opacity: 0.3; 
  `}
`;


@observer
export default class Loaders extends Component {
  state = {
    activeLoaders: this.props.activeLoaders && this.props.activeLoaders.toJS(),
  };

  containsLoader = (loaderKey) => this.state.activeLoaders.indexOf(loaderKey) !== -1;
  onChangeLoader = (loaderKey) => {
    let newLoadersList;
    if (this.containsLoader(loaderKey)) {
      newLoadersList = this.state.activeLoaders.filter(loader => loader !== loaderKey);
    } else {
      newLoadersList = this.state.activeLoaders.concat(loaderKey);
    }
    this.setState({
      activeLoaders: newLoadersList
    });
  }

  render() {
    const { loaderList: { loaders } } = this.props;
    return (
      <LoadersContainer>
      {loaders.map((loader) => (
        <div
          key={loader.key}
        >
          <LoaderText
            weight={600}
            size={15}
            block
          >
            {loader.name}
            <input
              type="checkbox"
              style={{ marginLeft: 10 }}
              checked={this.containsLoader(loader.key)}
              onChange={() => this.onChangeLoader(loader.key)}
            />
          </LoaderText>
          <LoaderText size={14} weight={400}>{loader.description}</LoaderText>
          <LoaderOptions isDisabled={!this.containsLoader(loader.key)}>
          {loader.options.map((eachSubLoader) => (
            <LoaderOptionSection
              key={eachSubLoader.key}
            >
              <LoaderText
                block
                weight={600}
                size={13}
              >
                <input
                  disabled={!this.containsLoader(loader.key)}
                  type="checkbox"
                  style={{ marginRight: 10 }}
                  onChange={() => this.onChangeLoader(eachSubLoader.key)} 
                  checked={this.containsLoader(eachSubLoader.key)}
                />
                {eachSubLoader.name}
              </LoaderText>
              <LoaderText weight={400} size={13}>{eachSubLoader.description}</LoaderText>
            </LoaderOptionSection>
          ))}
          </LoaderOptions>
        </div>
      ))}
    </LoadersContainer>);
  }
}