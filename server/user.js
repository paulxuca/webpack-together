const firebase = require('./firebase');
const uuid = require('uuid');

const initUser = (sessionName) => {
  const userID = uuid();
  firebase.addUser(userID, sessionName);
  return userID;
};

const userMiddleware = (req, res, next) => {
  const { sessionName, userID } = req.cookies;
  if (!userID) {
    const userID = initUser(sessionName);
    res.cookie('userID', userID, { expires: new Date(Date.now() + 36000000) });
  } else if (!firebase.hasUserInSession(sessionName, userID)) {
    firebase.addUser(sessionName, userID);
  }
  next();
}

module.exports = {
  initUser,
  userMiddleware,
};
