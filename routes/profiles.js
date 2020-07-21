const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
//const Users = require('models/Users');
const db = require('../models')

router.get('/:user', auth.optional, (req, res, next) => {
    res.render('profiles/profile', {user: req.params.user})
})
module.exports = router;