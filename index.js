const express = require('express');
const app = express();
const path = require('path');

const webpack = require('webpack');
const webpackConfig = require('./webpack/webpack.dev.config');
const compiler = webpack(webpackConfig);

const config = require('./config');

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'app', 'index.html'));
});

app.listen(config.server.port, (err) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }
  console.log(`Server listening at port ${config.server.port}`);
});