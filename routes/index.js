const express = require('express');
const router = express.Router();
const auth = require('./auth');
const db = require('../models')
const Room = require('../models/RoomSchema');
const crawler = require('../apify/crawler')

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
        db.Article.findOne({
            where: {
                url: room.url[0]
            }
        }).then((article) => {
            if(!article){
                try{
                    crawler(room.url[0]);
                }
                catch(err){
                    return res.send(err);
                }
                return res.redirect('/chat/'+req.params.roomid)
            }
            db.User.findOne({
                where: {
                    id: id
                }
            }).then((user) => {
                var title = article.title;
                if(title.length > 30){
                    title = title.substring(0,30);
                }
                if(user.admin != "(Admin)"){
                    return res.render('index', {admin: false, status: room.status, title: title, url: article.url});
                }
                else{
                    return res.render('index', {admin: true, id: req.params.roomid, status: room.status, title: title, url: article.url});
                }
            })
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