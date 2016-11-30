const app = require('./app').app;
const path = require('path');
const bodyParser = require('body-parser');

const firebase = require('./firebase');
const config = require('./config');
const webpackModules = require('./webpack');
const sessions = require('./sessions');
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(webpackModules.dev.devMiddleware);
app.use(webpackModules.dev.hotMiddleware);
app.use('/api', api);



app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'app', 'index.html'));
});


app.get('/api/session', routes.getSession);
app.post('/api/ensuresession', routes.ensureSession);
app.post('/api/saveall', routes.postSaveAll);
app.post('/api/newfile', routes.postNewFile);

// Active cleaning started for firebase
setInterval(() => firebase.activeClean(), 1000 * 60 * 60);

app.listen(config.server.port, (err) => {
  if (err) {
    console.log(err);
    process.exit(0);
  }
  console.log(`Server listening at port ${config.server.port}`);
});