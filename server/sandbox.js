const sessions = require('./sessions');

module.exports = {
  getIndex: (req, res) => {
    console.log(req.sessionName);
    res.sendStatus(200);
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
