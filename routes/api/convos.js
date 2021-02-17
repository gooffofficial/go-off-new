const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')
const Chat = require('../../models/ChatSchema')
const logger = require('../../logger')
const Room = require('../../models/RoomSchema')
const DM = require('../../models/DMSchema')
const io = require('socket.io-client')
const { body } = require('express-validator');
const _ = require('lodash')

router.post('/create', auth.required, [body('convoTime').escape()], (req, res, next) => {
    const {payload: { id, username } } = req;
    Room.create({
        url: req.body.article
    }, (err, room) => {
        if(err){
            console.log(err)
            return res.status(422).json({
                error: err
            })
        }
        //console.log("IDDDDD "+room._id)
        db.Convo.create({
            article: req.body.article,
            host: id,
            time: req.body.convoTime,
            roomId: ''+room._id
        }).then((convo) => {
            return res.redirect('/conversation/?article='+req.body.article)
        })
    })
})

router.post('/join', auth.required, [body('convo').escape()], (req, res, next) => {
    const {payload: {id, username}} = req;
    db.Convo_members.create({
        UserId: id,
        ConvoId: req.body.convo
    }).then(() => {
        res.sendStatus(200);
    })
})

module.exports = router;