const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/profiles', require('./profiles'))

module.exports = router;