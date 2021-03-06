const app = require('./app').app;
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const firebase = require('./firebase');
const config = require('./config');
const sessions = require('./sessions');
const routes = require('./routes');
const utils = require('./utils');
const sandbox = require('./sandbox');
const vendor = require('./vendor');
const npm = require('./npm');
const stats = require('./stats');
const user = require('./user');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack/webpack.dev.config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

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

app.get('/stats', stats.displayStats);

app.use(/\/api\/(sandbox|session)/, routes.sandboxMiddleware);
app.use('/api/session', routes.intentMiddleware);
app.use('/api', user.userMiddleware);

app.post('/api/session', routes.update);

app.get('/api/loaders', routes.loaderOptions);
app.get('/api/sandbox', sandbox.getIndex);
app.get('/api/sandbox/tools.js', sandbox.getTools);
app.get('/api/vendor/:vendorHash', vendor.getVendorFile);

app.get('/join/:sessionName', routes.join);

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