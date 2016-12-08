const server = {
  port: 3000,
};

const api = {
  dev: {
    baseUrl: `http://localhost:${server.port}`,
  },
  prod: {
    baseUrl: 'SOMETHING_BASE_URL_HERE',
  },
};

const apiUrl = process.env.NODE_ENV === 'production' ? `${api.prod.baseUrl}/api` : `${api.dev.baseUrl}/api`;

const firebase = {
  apiKey: 'AIzaSyB0rdg2YHut3woGEwvfG3tA-PeeGxny0LA',
  authDomain: 'webpack-together.firebaseapp.com',
  databaseURL: 'https://webpack-together.firebaseio.com',
  storageBucket: 'webpack-together.appspot.com',
  messagingSenderId: '1043479647353'
};

module.exports = {
  api,
  server,
  firebase,
  apiUrl,
  getWebpackUrl: (sessionName) => `${apiUrl}/sandbox/${sessionName}/bundle.js`,
  getVendorUrl: vendorHash => `${apiUrl}/vendor/vendor_${vendorHash}.js`,
}