module.exports = {
  firebase: {
    apiKey: "AIzaSyB0rdg2YHut3woGEwvfG3tA-PeeGxny0LA",
    authDomain: "webpack-together.firebaseapp.com",
    databaseURL: "https://webpack-together.firebaseio.com",
    storageBucket: "webpack-together.appspot.com",
    messagingSenderId: "1043479647353"
  },
  librariesio: {
    apiUrl: (query) => `https://libraries.io/api/search?q=${query}&platforms=npm&api_key=67b17c72ed889049f8cac748c50f80ec&per_page=5`
  },
};
