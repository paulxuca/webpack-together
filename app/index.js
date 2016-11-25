import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { initializeFirebase } from './utils/firebase';
import { injectGlobal } from 'styled-components';
import config from './config';

import App from './app';
import stores from './store';

injectGlobal`
  body {
    margin: 0;
  }
`;


initializeFirebase(config.firebase);
const store = stores();

render(
  <AppContainer>
    <App store={store} />
  </AppContainer>,
document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>,
    document.getElementById('app'));
  });
}