import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
export default class Loaders extends Component {
  render() {
    const { loaderList: { loaders } } = this.props;
    return(
      <div>
      {loaders.map((each) => each.name)}
    </div>);
  }
}