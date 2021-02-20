const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
//const Users = require('models/Users');
const db = require('../models')

router.get('/:user', auth.required, (req, res, next) => {
    const { payload: {id, username} } = req;
    db.Convo_members.findAll({
        where: {
            UserId: id
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
            conv['title'] = art.title.substring(0,25);
            conv['img'] = art.img;
            conv['id'] = c.roomId;
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
            if(Date.now() < Date.parse(c.time)){
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
        res.render('profiles/profile', {myUser: username, user: req.params.user, prevConvos: prevConvos, upConvos: upConvos, upcomingConvo: upcomingConvo, numUpcoming: numUpcoming})
    })
})
module.exports = router;