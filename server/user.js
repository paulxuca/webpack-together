const firebase = require('./firebase');
const uuid = require('uuid');

const initUser = (sessionName) => {
  const userID = uuid();
  firebase.addUser(userID, sessionName);
  return userID;
};

const userMiddleware = (req, res, next) => {
  const { sessionName } = req;
  if (!req.cookies.userID) {
    const userID = initUser(sessionName);
    res.cookie('userID', userID, { expires: new Date(Date.now() + 36000000) });
  }
  next();
}

module.exports = {
  initUser,
  userMiddleware,
};
