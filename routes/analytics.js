const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
//const Users = require('models/Users');
const db = require('../models')
const Room = require('../models/RoomSchema')
const crawler = require('../apify/crawler')
const {spawn} = require('child_process');

router.get('/', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    return db.User.findOne({
        where: {
            id: id
        }
    }).then(async (user) => {
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)" || user.host != "(Host)"){
            return res.sendStatus(401).json({"Err": "Unauthorized"})
        }
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)" || user.host != "(Host)"){
            return res.sendStatus(401).json({"Err": "Unauthorized"})
        }
        db.Analytics.findAll({
            limit: 5,
            order: [ ['createdAt', 'DESC']]
        }).then(async (analyses) => {
            let data = []
            let articles = []
            console.log("ANALYSES LENGth "+analyses.length+"\n"+analyses)
            for (const analysis of analyses) {
                let anal = await Room.findById(analysis.id);
                console.log("AHHHHHHHH" + anal);
                let art = await db.Article.findOne({
                    where: {
                        url: anal.url[0]
                    }
                })
                console.log(art);
                if(!art){
                    try{
                        crawler(anal.url[0])
                    }
                    catch(err){
                        return res.send(err)
                    }   
                    return res.redirect('/analytics')                     
                }
                data.push(analysis.getData());
                articles.push(art.getArticleInfo());
            }
            return res.render('analysis/dashboard', {user:user.username, data: data, article: articles})
        })
    })
})

router.get('/convos', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    var data = []
    var articles = []
    return db.User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)" || user.host != "(Host)"){
            return res.sendStatus(401).json({"Err": "Unauthorized"})
        }
        db.Analytics.findAll({
            limit: 5,
            order: [ ['createdAt', 'DESC']]
        }).then(async (analyses) => {
            console.log("ANALYSES LENGth "+analyses.length+"\n"+analyses)
            for (const analysis of analyses) {
                let anal = await Room.findById(analysis.id);
                console.log("AHHHHHHHH" + anal);
                let art = await db.Article.findOne({
                    where: {
                        url: anal.url[0]
                    }
                })
                console.log(art);
                if(!art){
                    if (!anal.url[0].includes("thesweatypengin.com")){
                        try{
                            crawler(anal.url[0])
                        }
                        catch(err){
                            return res.send(err)
                        }   
                        return "err"   
                    }                  
                }
                else{
                    data.push(analysis.getData());
                    articles.push(art.getArticleInfo());
                }
            }
            return ({data:data, articles:articles})
        }).then(async (result) => {
            if (result=="err"){
                res.redirect('/analytics/convos')
            }
            let allConvoArt = []
            let allConvoData = []
            let rooms = await Room.find();
            for(let room of rooms){
                console.log(room.url)
                if(room.url[0].includes("thesweatypenguin.com")){
                    continue
                }
                var roomData = await db.Analytics.findOne({
                    where: {
                        id: room._id.toString()
                    }
                })
                var roomArt = await db.Article.findOne({
                    where: {
                        url: room.url[0] 
                    }
                })
                if(roomArt && roomData){
                    allConvoArt.push(roomArt.getArticleInfo())
                    allConvoData.push(roomData.getData())
                } 
            }
            console.log(result)
            console.log(result.data)
            console.log(result.articles)
            return res.render('analysis/convo_splash', {user: user.getUserInfo().username, article: result.articles, data: result.data, allConvoArt: allConvoArt, allConvoData: allConvoData});
        })
    })
})

router.get('/users', auth.required, (req,res,next) => {
    const { payload: { id } } = req;
    return db.User.findOne({
        where: {
            id: id
        }
    }).then(async (user) => {
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)" || user.host != "(Host)"){
            return res.sendStatus(401).json({"Err": "Unauthorized"})
        }
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)" || user.host != "(Host)"){
            return res.sendStatus(401).json({"Err": "Unauthorized"})
        }
        db.Analytics.findAll({
            limit: 5,
            order: [ ['createdAt', 'DESC']]
        }).then(async (analyses) => {
            let data = []
            let articles = []
            console.log("ANALYSES LENGth "+analyses.length+"\n"+analyses)
            for (const analysis of analyses) {
                let anal = await Room.findById(analysis.id);
                console.log("AHHHHHHHH" + anal);
                let art = await db.Article.findOne({
                    where: {
                        url: anal.url[0]
                    }
                })
                console.log(art);
                if(!art){
                    try{
                        crawler(anal.url[0])
                    }
                    catch(err){
                        return res.send(err)
                    }   
                    return res.redirect('/analytics')                     
                }
                data.push(analysis.getData());
                articles.push(art.getArticleInfo());
            }
            return res.render('analysis/user_aggregate', {user:user.username, data: data, article: articles});
        })
    })
})

router.get('/:chat', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    return db.User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        var userInfo = user.getUserInfo();
        if (user.admin != "(Admin)"){
            return res.sendStatus(401).json({"Err":"Unauthorized"})
        }
        db.Analytics.findOne({
            where: {
                id: req.params.chat
            }
        }).then((analysis) => {
            //run python analysis if it has not already been run for this conversation
            if(!analysis){
                var python = spawn('python3', ['./data-analysis/vanity.py', req.params.chat]);
                python.stderr.on('data', function (data){
                    console.log(data.toString())
                    return res.json({"Err": "Somehing went wrong with your analysis"})
                });            
                python.stdout.on('data', (data) => {
                    console.log(data.toString())
                    python2 = spawn('python3', ['./data-analysis/nlp_testclean.py', req.params.chat])
                    python2.stderr.on('data', function (data) {
                        console.log(data.toString())
                        return res.json({"Err": "Something went wrong with your analysis"})
                    })
                    python2.stdout.on('data', function(data) {
                        console.log(data.toString());
                        return res.redirect('/analytics/'+req.params.chat);
                    })
                });
            }
            else{
                //Find the room in the mongodb database
                Room.findById(req.params.chat, (err, room) => {
                    if(err){
                        console.log(err);
                        return res.send(err);
                    }
                    db.Article.findOne({
                        where: {
                            url: room.url[0]
                        }
                    }).then((article) => {
                        //if we have not already scraped this article, do so and refresh the page
                        if(!article){
                            try{
                                crawler(room.url[0])
                            }
                            catch(err){
                                return res.send(err)
                            }
                            return res.redirect('/analytics/'+req.params.chat)                          
                        }
                        //get the 5 most recent conversation for sidebar
                        return db.Analytics.findAll({
                            limit: 5,
                            order: [ ['createdAt', 'DESC']]}).then(async (analyses) =>{
                                let datas = []
                        let articles = []
                        console.log("ANALYSES LENGth "+analyses.length+"\n"+analyses)
                        for (const analysis of analyses) {
                            let anal = await Room.findById(analysis.id);
                            console.log("AHHHHHHHH" + anal);
                            let art = await db.Article.findOne({
                                where: {
                                    url: anal.url[0]
                                }
                            })
                            console.log(art);
                            //if article hasn't been scraped, then do so
                            if(!art){
                                try{
                                    crawler(anal.url[0])
                                }
                                catch(err){
                                    return res.send(err)
                                }   
                                return res.redirect('/analytics/'+req.params.chat)                     
                            }
                            
                            datas.push(analysis.getData());
                            articles.push(art.getArticleInfo());
                        }
                        return res.render('analysis/convo', {id:req.params.chat, user: user.getUserInfo().username, article: article.getArticleInfo(), data: analysis.getData(), room:req.params.chat, datas: datas, articles: articles})
                            })
                    })
                })
            }
        })
    })
})

router.get('/:chat/user', auth.required, (req,res,next) => {
    const { payload: { id } } = req;
    return db.User.findOne({
        where:{
            id: id
        }
    }).then((user) => {
        if(user.admin != '(Admin)'){
            return res.sendStatus(401).json({"Err": "Unauthorized"})
        }
        db.Analytics.findOne({
            where: {
                id: req.params.chat
            }
        }).then((analysis) => {
            if (!analysis){
                return res.redirect('/analytics/'+req.params.chat)
            }
            else{
                //Find the room in the mongodb database
                Room.findById(req.params.chat, (err, room) => {
                    if(err){
                        console.log(err);
                        return res.send(err);
                    }
                    db.Article.findOne({
                        where: {
                            url: room.url[0]
                        }
                    }).then((article) => {
                        //if we have not already scraped this article, do so and refresh the page
                        if(!article){
                            try{
                                crawler(room.url[0])
                            }
                            catch(err){
                                return res.send(err)
                            }
                            return res.redirect('/analytics/'+req.params.chat)                          
                        }
                        //get the 5 most recent conversation for sidebar
                        return db.Analytics.findAll({
                            limit: 5,
                            order: [ ['createdAt', 'DESC']]}).then(async (analyses) =>{
                                let datas = []
                        let articles = []
                        console.log("ANALYSES LENGth "+analyses.length+"\n"+analyses)
                        for (const analysis of analyses) {
                            let anal = await Room.findById(analysis.id);
                            console.log("AHHHHHHHH" + anal);
                            let art = await db.Article.findOne({
                                where: {
                                    url: anal.url[0]
                                }
                            })
                            console.log(art);
                            //if article hasn't been scraped, then do so
                            if(!art){
                                try{
                                    crawler(anal.url[0])
                                }
                                catch(err){
                                    return res.send(err)
                                }   
                                return res.redirect('/analytics/'+req.params.chat)                     
                            }
                            
                            datas.push(analysis.getData());
                            articles.push(art.getArticleInfo());
                        }
                        return res.render('analysis/user_ind', {id: req.params.chat, user: user.getUserInfo().username, article: article.getArticleInfo(), data: analysis.getData(), room:req.params.chat, datas: datas, articles: articles})
                            })
                    })
                })
            }
        })
    })
})

module.exports = router;