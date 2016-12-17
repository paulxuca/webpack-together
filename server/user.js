const firebase = require('./firebase');
const uuid = require('uuid');

const initUser = () => {
  const userID = uuid();
  return userID;
};

const userMiddleware = (req, res, next) => {
  if (!req.cookies.userID) {
    const userID = initUser();
    res.cookie('userID', userID, { expires: 36000000 });
  }
  next();
}

module.exports = {
  initUser,
  userMiddleware,
};
