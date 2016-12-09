const app = require('./app').app;
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const firebase = require('./firebase');
const config = require('./config');
const sessions = require('./sessions');
const routes = require('./routes');
const utils = require('./utils');
const sandbox = require('./sandbox');
const vendor = require('./vendor');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack/webpack.dev.config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


if (!utils.isProduction()) {
  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      chunks: false,
      colors: true,
    },
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.post('/api/session', routes.update);

app.use('/api/sandbox', sandbox.sandboxMiddleware);
app.get('/api/sandbox', sandbox.getIndex);
app.get('/api/vendor/:vendorHash', vendor.getVendorFile);

//Clear all existing bundles and what not
sessions.initializeSessionBundles();
vendor.initializeVendorFolder();
// Active cleaning started for firebase
setInterval(() => firebase.activeClean(), 1000 * 60 * 60);

app.listen(config.server.port, (err) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }
  console.log(`Server listening at port ${config.server.port}`);
});