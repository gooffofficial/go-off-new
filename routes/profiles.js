const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
//const Users = require('models/Users');
const db = require('../models')

router.get('/:user', auth.required, (req, res, next) => {
    const { payload: {id, username} } = req;
    return db.User.findOne({
        where: {
            username: req.params.user
        }
    })
    .then((user) => {
        db.Convo_members.findAll({
            where: {
                UserId: user.id
            }
        }).then(async (conversations) => {
            if (!conversations || conversations.length < 1){
                return res.render('profiles/profile', {myUser: username, user: req.params.user, upConvos: [], prevConvos: [], upcomingConvo: upcomingConvo, numUpcoming: numUpcoming})
            }
            upConvos = []
            prevConvos = []
            for (const convo of conversations) {
                let conv = {}
                var c = await db.Convo.findOne({
                    where: {
                        id: convo.ConvoId
                    }
                });
                var art = await db.Article.findOne({
                    where: {
                        url: c.article
                    }
                })
                conv['date'] = c.time;
                conv['title'] = c.title;
                conv['img'] = art.img;
                conv['id'] = c.roomId;
                conv['description'] = c.description;
                //get username of host
                var host = await db.User.findOne({
                    where: {
                        id: c.host
                    }
                })
                if (!host){
                    conv['host'] = ""
                }
                else{
                    conv['host'] = host.username;
                }
                if(Date.now() < c.time){
                    upConvos.push(conv);
                }
                else{
                    prevConvos.push(conv)
                }
            }
            var upcomingConvo = false;
            var numUpcoming = 0;
            if(upConvos.length > 0){
                for(var i=0; i < upConvos.length; i++){
                    if(Date.parse(upConvos[i].date) - Date.now() < 1800000){
                        upcomingConvo = true;
                        numUpcoming++;
                    }
                }
            }
            upConvos.sort(function(a, b) {
                var keyA = new Date(a.date),
                  keyB = new Date(b.date);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
              prevConvos.sort(function(a, b) {
                var keyA = new Date(a.date),
                  keyB = new Date(b.date);
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              });
            res.render('profiles/profile', {myUser: username, user: req.params.user, prevConvos: prevConvos, upConvos: upConvos, upcomingConvo: upcomingConvo, numUpcoming: numUpcoming})
        })
    })
})
module.exports = router;