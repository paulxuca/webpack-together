const firebase = require('./firebase');
const uuid = require('uuid');

const initUser = (sessionName) => {
  const userID = uuid();
  firebase.addUser(userID, sessionName);
  return userID;
};

const userMiddleware = (req, res, next) => {
  const { sessionName } = req.cookies;
  if (!req.cookies.userID) {
    const userID = initUser(sessionName);
    res.cookie('userID', userID, { expires: new Date(Date.now() + 36000000) });
  } else if (!firebase.hasUserInSession(sessionName, req.cookies.userID)) {
    firebase.addUser(sessionName, req.cookies.userID);
  }
  next();
}

module.exports = {
  initUser,
  userMiddleware,
};
