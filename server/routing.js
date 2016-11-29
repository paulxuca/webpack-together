const router = require('express').Router();
const routes = require('./routes');

router.get('/session', routes.getSession);
router.post('/saveall', routes.postSaveAll);
router.post('/newfile', routes.postNewFile);

module.exports = router;