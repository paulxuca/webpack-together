const app = require('./app').app;
const path = require('path');
const bodyParser = require('body-parser');

const firebase = require('./firebase');
const config = require('./config');
const sessions = require('./sessions');
const routes = require('./routes');
const utils = require('./utils');
const preloader = require('./preload');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack/webpack.dev.config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


preloader([
  'process',
  'webpack-hot-middleware',
  'webpack-dev-middleware',
  'react',
  'react-dom',
  'babel-loader',
  'babel-preset-es2015',
  'babel-preset-react',
  'babel-preset-stage-0',
  'webpack',
]);

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

app.get('/api/session', routes.getSession);
app.post('/api/ensuresession', routes.ensureSession);
app.post('/api/saveall', routes.postSaveAll);
app.post('/api/newfile', routes.postNewFile);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'app', 'index.html'));
});


// Active cleaning started for firebase
setInterval(() => firebase.activeClean(), 1000 * 60 * 60);

app.listen(config.server.port, (err) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }
  console.log(`Server listening at port ${config.server.port}`);
});