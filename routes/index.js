const express = require('express');
const router = express.Router();
const auth = require('./auth');
const db = require('../models')
const Room = require('../models/RoomSchema')

router.use('/api', require('./api'));
router.use('/profiles', require('./profiles'))
router.use('/analytics', require('./analytics'))

router.get('/profile_edit', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/profile_edit', {user: username})
})

router.get('/account_settings', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/account_settings', {user: username})
})

router.get('/followers', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/followers', {user: username})
})

router.get('/following', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/following', {user: username})
})

router.get('/chat/:roomid', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    Room.findById(req.params.roomid, (err, room) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        db.User.findOne({
            where: {
                id: id
            }
        }).then((user) => {
            if(user.admin != "(Admin)"){
                return res.render('index', {admin: false, status: room.status});
            }
            else{
                return res.render('index', {admin: true, id: req.params.roomid, status: room.status});
            }
        })
    })
})

router.get('/login', auth.optional, (req, res, next) => {
    res.render('login')
})

router.get('/signup', auth.optional, (req, res, next) => {
    res.render('signup')
})

router.get('/', auth.optional, (req, res, next) => {
    res.render('splash')
})
module.exports = router;