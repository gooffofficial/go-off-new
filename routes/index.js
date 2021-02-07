const express = require('express');
const router = express.Router();
const auth = require('./auth');
const db = require('../models')
const Room = require('../models/RoomSchema');
const DM = require('../models/DMSchema')
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

router.get('/followers/:user', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/followers', {user: req.params.user})
})

router.get('/following', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/following', {user: username})
})

router.get('/following/:user', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('profiles/following', {user: req.params.user})
})

router.get('/feed', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('feed', {user: username})
})

router.get('/feed/:user', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    res.render('feed', {user: req.params.user})
})

router.get('/conversation', auth.required, (req, res, next) => {
    const { payload: { username} } = req;
    var article = req.query["article"];
    console.log("SDIFUHGJBSIHDFGJHISDFGNIUHGJODFSKNIRJGSFK\n\n\n\n\n");
    console.log(article);
})

router.get('/folder/:id', auth.required, (req, res, next) => {
    const { payload: { username} } = req;
    
    db.SavedArticle.findAll({
        where: {
            FolderId: req.params.id
        }
    }).then((articles) => {
        var save = [] 
        for(var i = 0; i < articles.length; i++){
            save.push(articles[i].getFolderInfo());
        }
        console.log(articles);
        res.render('profiles/folder', {articles: save})
    }
)})

//route to get into direct messages
router.get('/m/:username', auth.required, (req, res, next) => {
    const { payload: { username, id } } = req;
    db.User.findOne({
        where: {
            username: req.params.username
        }
    }).then(async (user) => {
        if(!user){
            return res.json({"err": "User not found"})
        }
        var profile = await db.Profile.findOne({
            where: {
                userId: user.id
            }
        });
        var userPic = profile.ppic;
        var users = [req.params.username, username];
        users.sort();
        var roomIdentifier = users[0]+users[1] 
        DM.findOne(
            {identifier: roomIdentifier}, (err, room) => {
                if(err){
                    console.log(err);
                }
                var lastMessages = [];
                DM.find({users: id}).populate('messages').then(async (dms, err) => {
                    if(err){
                        console.log(err);
                    }
                    //Get the last messages from all dm conversations
                    for(let i=0; i < dms.length; i++){
                        for(let k=0; k<dms[i].users.length; k++){
                            if (dms[i].users[k] != "163") {
                                lastMessages.push([dms[i].users[k], dms[i].messages[dms[i].messages.length - 1].message])
                            } 
                        }
                    }
                    //Get the username for all dm conversations
                    //TODO: Optimize query for users
                    for(let i=0; i<lastMessages.length; i++){
                        let user = await db.User.findOne({
                            where: {
                                id: lastMessages[i][0]
                            }
                        })
                        let profile = await db.Profile.findOne({
                            where: {
                                userId: lastMessages[i][0]
                            }
                        })
                        if(!user || !profile){
                            lastMessages[i][0] = null;
                            lastMessages[i][1] = null;
                            lastMessages[i][2] = null;
                        }
                        lastMessages[i][0] = user.username;
                        lastMessages[i].push(profile.ppic);
                    }
                    res.render('dm', {admin: true, id: req.params.username, status: false, title: req.params.username, url: '/profiles/'+req.params.username, js: "dm.js", lastMessages: lastMessages, userPic: userPic});
                })
            }
        )
    })

})

//route to get into individual chatrooms
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
                    return res.render('index', {admin: false, id: req.params.roomid, status: room.status, title: title, url: article.url, js: "index.js"});
                }
                else{
                    return res.render('index', {admin: true, id: req.params.roomid, status: room.status, title: title, url: article.url, js: "index.js"});
                }
            })
        })
    })
})

router.get('/usertype', auth.optional, (req, res, next) => {
    res.render('usertype')
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