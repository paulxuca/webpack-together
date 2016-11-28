const router = require('express').Router();
const firebase = require('./firebase');

const handleError = (error, res) => {
  console.log(error);
  res.status(400).json(error);
}

router.get('/session', async (req, res) => {
  try {
    const session = await firebase.createSession();
    res.status(200).json(session);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/saveall', async (req, res) => {
  const { sessionName } = req.body;
  try {
    await firebase.saveAll(sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/newfile', async (req, res) => {
  const { fileName, isEntry, sessionName } = req.body;
  try {
    await firebase.createFile(fileName, isEntry, sessionName);
    res.sendStatus(200);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
