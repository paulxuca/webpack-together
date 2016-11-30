let apiURL;

if (process.env.NODE_ENV === 'production') {
  apiURL = 'SOMETHING HERE';
} else {
  baseURL = 'http://localhost:3000';
  apiURL = `${baseURL}/api`;
}

module.exports = {
  getWebpackUrl(sessionName) {
    return `${apiURL}/sandbox/${sessionName}`;
  },
  getBaseUrl: baseURL,
  getApiUrl: apiURL,
}