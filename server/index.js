const express = require('express');
const app = express();
const path = require('path');

const api = require('./routes');
const webpack = require('./webpack');
const firebase = require('./firebase');
const config = require('./config');

app.use('/api', api);
app.use(webpack.devMiddleware);
app.use(webpack.hotMiddleware);

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