const sessions = require('./sessions');
const fs = require('./filesystem');

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
    res.sendStatus(200);
  },
  sandboxMiddleware(req, res, next) {
    if (sessions.hasBundle(req.cookies.sessionName)) {
      req.sessionName = req.cookies.sessionName;
      next();
    }
  }
};
