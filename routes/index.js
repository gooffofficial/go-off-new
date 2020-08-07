const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use('/api', require('./api'));
router.use('/profiles', require('./profiles'))

router.get('/profile_edit', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/profile_edit', {user: username})
})

router.get('/account_settings', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/account_settings', {user: username})
})

router.get('/chat/:roomid', auth.required, (req, res, next) => {
    res.render('index')
})
module.exports = router;