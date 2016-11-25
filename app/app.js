import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Provider } from 'mobx-react';
import Editor from './containers/Editor';

@observer
export default class App extends Component {
  static propTypes = {
    store: PropTypes.object,
  };

  componentWillMount() {
    this.props.store.app.getSession();
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <Editor />
      </Provider>
    );
  }
}