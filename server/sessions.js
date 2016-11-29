const sessions = {};
const app = require('./app').app;
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

module.exports = {
  addSession(sessionName, config){
    const compiler = webpack(config);
    const dev = devMiddleware(compiler);
    const hot = hotMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath });

    sessions[sessionName] = {
      sessionName,
      dev,
      hot,
    };

    app.use(dev);
    app.use(hot);
    return sessions[sessionName];
  },
  getSession(sessionName) {
    return sessions[sessionName];
  },
  removeSession(sessionName) {
    delete sessions[sessionName];
  },
  hasBundle(sessionName) {
    return Object.keys(sessions).indexOf(sessionName) !== -1
  }
};
