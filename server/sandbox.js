const sessions = require('./sessions');
const fs = require('./filesystem');
const firebase = require('./firebase');
const mime = require('mime');
const path = require('path');

const tools = fs.fs.readFileSync(path.resolve(process.cwd(), 'server', 'tools.js'), 'utf8').toString();

module.exports = {
  getIndex: (req, res) => {
    const index = fs.getSessionFile(req.sessionName, 'index.html');
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    res.type('html');
    res.status(200).send(index);
  },
  getFile: (req, res) => {
    const file = fs.getBundleFile(req.sessionName);
    if (file) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Content-Length', file.length);
      res.status(200).send(file);
    }
  },
  getTools(req, res) {
    res.setHeader('Cache-Control', 'public max-age=36000');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Content-Length', tools.length);
    res.status(200).send(tools);
  }
};
