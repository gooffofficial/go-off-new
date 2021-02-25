const express = require('express');
const router = express.Router();
const auth = require('./auth');
const db = require('../models')
const Room = require('../models/RoomSchema');
const DM = require('../models/DMSchema')
const crawler = require('../apify/crawler');
const sequelize = require('../sequelize');
const Sequelize = require('sequelize')

const seq = new Sequelize('test_server1', process.env.RDS_USER, process.env.RDS_PASSWORD, {
    port: process.env.RDS_PORT,
    host: process.env.RDS_HOSTNAME,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })

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

//Requesting Verification Code
router.get("/verify", (req, res) => {
    res.render("emailver", { email: req.query.email });
  });

router.get('/feed', auth.required, (req, res, next) => {
    const { payload: { id, username } } = req;
    //seq.query("SELECT article FROM test_server1.SavedArticles S, test_server1.Folders F, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND F.id=S.FolderId")
    seq.query("SELECT article FROM test_server1.SavedArticles S, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND Fol.followed=S.userId")
    .then(async (articles) => { 
        var arts = []
        for(var i=0; i<articles[0].length; i++){
            arts.push(articles[0][i].article)
        } 
        console.log(arts)
        var arts2 = []
        for(const art of arts){
            var art2 = {}
            let a = await db.Article.findOne({
                where: {
                    url: art
                }
            })
            if (!a) {
            art2['img'] = ""
            art2['title'] = ""
            art2['link'] = ""
            }else{
                art2['img'] = a.getArticleInfo()['img']
                art2['title'] = a.getArticleInfo()['title']
                art2['link'] = a.getArticleInfo()['url']
            }
            arts2.push(art2)
        }
        console.log(arts2.length)
        arts2 = arts2.reverse();
        if(arts2.length == 0){
            let a = {
                img: '',
                title: '',
                link: '' 
            }
            arts2.push(a);
            arts2.push(a);
            arts2.push(a);
            arts2.push(a);
        }
        if (arts.length == 1){
            let a = {
                img: '',
                title: '',
                link: ''
            }
            arts2.push(a);
            arts2.push(a);
            arts2.push(a);
        }
        if (arts.length == 2){
            let a = {
                img: '',
                title: '',
                link: ''
            }
            arts2.push(a)
            arts2.push(a)
        }
        if (arts.length == 3){
            let a = {
                img: '',
                title: '',
                link: ''
            }
            arts2.push(a)
        }
        seq.query("SELECT ConvoId FROM test_server1.Convo_members C, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND Fol.followed=C.UserId")
        /*db.Convo_members.findAll({
            where: {
                UserId: id
            }
        })*/
        .then(async (convos) => {
            var convs = []
            var i = 0
            for (const convo of convos[0]){
                let c = await db.Convo.findOne({
                    where: {
                        id: convo.ConvoId
                    }
                })
                convs.push(c);
                let art = await db.Article.findOne({
                    where: {
                        url: c.article
                    }
                })
                let user = await db.User.findOne({
                    where: {
                        id: c.host
                    }
                })
                if(!user){
                    convs[i]['host'] = " "

                }else{
                    convs[i]['host'] = user.username
                }
                
                convs[i]['img'] = art.img
                convs[i]['title'] = art.title
                i++
            }
            convs=convs.reverse();
            if(convs.length == 0) {
                convs[0] = {
                    article: "",
                    id: -1
                }
                convs[1] = {
                    article: "",
                    id: -1
                }
                convs[2] = {
                    article: "",
                    id: -1
                }
                convs[3] = {
                    article: "",
                    id: -1
                }
            }
            else if(convs.length == 1){
                convs[1] = {
                    article: "",
                    id: -1
                }
                convs[2] = {
                    article: "",
                    id: -1
                }
                convs[3] = {
                    article: "",
                    id: -1
                }
            }
            else if(convs.length == 2){
                convs[2] = {
                    article: "",
                    id: -1
                }
                convs[3] = {
                    article: "",
                    id: -1
                }
            }
            else if(convs.length == 3){
                convs[3] = {
                    article: "",
                    id: -1
                }
            }
            console.log(convs[0].article)
            console.log(arts2[1].article + "AHAFJHSD;KJFGPAWUEHFBKSDJFGWPEUIFHSDJHFBGWEIURHFSDVGLSIDUBS\N\N\N\N\N\N\N\N\N\N\N")
            res.render('feed', {myuser: username, user: req.params.user, articles: arts2, convos: convs})
        })
    })
})

// router.get('/feed/:username', auth.required, (req, res, next) => {
//     const { payload: { id, username } } = req; 
//     console.log("I AM IN The FEED")
//     sequelize.query("SELECT * FROM test_server1.SavedArticles S, test_server1.Folders F, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND F.id=S.FolderId")
//     .then((articles) => {
//         console.log("THEEEESE ARE THE ARTICLES: "+ articles)   
//         res.render('feed', {user: req.params.user})
//     })
// })

router.get('/conversation', auth.required, (req, res, next) => {
    const { payload: { username} } = req;
    var article = req.query["article"];
    //picture, title, author, link
    db.Article.findOne({
        where: {
            url: article
        }
    }).then((art) => {
        if(!art){
            try{
                crawler(req.query["article"]);
            }
            catch(err){
                return res.send(err);
            }
            return res.redirect('/conversation/article?article='+req.query["article"])
        }
        db.Convo.findAll({
            limit: 2,
            where: {
                article: article
            }
        }).then(async (convos) => {
            var hosts = []
            // current timestamp in milliseconds
            for (const convo of convos){
                let host = await db.User.findOne({
                    where: {
                        id: convo.host
                    }
                })
                hosts.push(host.username)
            }
            if(hosts.length == 0){
                hosts[0] = ""
                hosts[1] = ""
            }
            else if(hosts.length == 1){
                hosts[1] = ""
            }
            if (convos.length == 0){
                convos[0] = {
                    time: "No convo scheduled",
                    id: -1
                }
                convos[1] = {
                    time: "No convo scheduled",
                    id: -1
                }
            }
            else if (convos.length == 1){
                convos[1] = {
                    time: "No convo scheduled",
                    id: -1
                }
            }
            let ts = Date.now();
            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            return res.render('conversation', {user: username, articlePic: art.img, artTitle: art.title, artLink: article, desc: convos.description, title: convos.title, date: year + "-" + month + "-" + date+"T00:00", convos: convos, hosts: hosts})  
        })
    })
})

router.get('/folder/:id', auth.required, (req, res, next) => {
    const { payload: { username} } = req;
    
    db.SavedArticle.findAll({
        where: {
            FolderId: req.params.id
        }
    }).then((articles) => {
        var save = [] 
        if (articles.length == 0){
            console.log("ENTERED ERRORORR MOODE")
            return res.status(422).json({
                errors: {
                    article: "not found" 
                }
            })
        }else{
        for(var i = 0; i < articles.length; i++){
            save.push(articles[i].getFolderInfo());
        }
        console.log(articles);
        res.render('profiles/folder', {articles: save})
    }
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
                    res.render('dm', {user: username, admin: true, id: req.params.username, status: false, title: req.params.username, url: '/profiles/'+req.params.username, js: "dm.js", lastMessages: lastMessages, userPic: userPic});
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
                    return res.render('index', {user: user.username, admin: false, id: req.params.roomid, status: room.status, title: title, url: article.url, js: "index.js"});
                }
                else{
                    return res.render('index', {user: user.username, admin: true, id: req.params.roomid, status: room.status, title: title, url: article.url, js: "index.js"});
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