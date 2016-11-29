let apiURL;

if (process.env.NODE_ENV === 'production') {
  apiURL = 'SOMETHING HERE';
}
apiURL = 'http://localhost:3000/api';

module.exports = {
  getWebpackUrl(sessionName) {
    return `${apiURL}/sandbox/${sessionName}`;
  }
}