const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const api = require('./routes');
const firebase = require('./firebase');
const config = require('./config');
const webpackModules = require('./webpack');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(webpackModules.dev.devMiddleware);
app.use(webpackModules.dev.hotMiddleware);
app.use('/api', api);

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