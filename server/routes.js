const router = require('express').Router();
const firebase = require('./firebase');

router.get('/session', async function(req, res) {
  try {
    const session = await firebase.createSession();
    res.status(200).json(session);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = router;
