const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')
const Chat = require('../../models/ChatSchema')
const logger = require('../../logger')
const Room = require('../../models/RoomSchema')
const io = require('socket.io-client')
const _ = require('lodash')


var socket = io.connect('http://127.0.0.1:4050');

db.User.findAll({
    where: {
        admin: "(Admin)"
    }
}).then((admins) => {
    adminNames = [];
    admins.forEach(element => {
        adminNames.push(element.username)
    });
console.log(socket)
router.post('/', auth.required, (req, res, next) => {
    const { payload: { username }} = req;
    const message = req.body.message;
    socket.emit('input', {
        name: username,
        message: message,
        room: 'test',
    });
    console.log('Chat sent')
    return res.status(200);
})


//testing to create a room
router.get('/create', auth.required, (req, res, next) => {
    const{ payload: { id }} = req;
    if(id != 15 && id != 33){
        return res.status(401).json({"authorization": "failed"})
    }
    let newRoom = new Room({users: [id]});
    newRoom.save().then(() => {
        console.log("saved");
        return res.status(200).json({"created": "success"});
    });
})


//Route to post messages to specific chatroom
router.post('/:room', auth.required, (req, res, next) => {
    Room.findById(req.params.room, (err, room) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        const { payload: { username, id }} = req;
        const message = req.body.message;
        //create message object
        let chatMessage = new Chat({user: id, name: username, message: message});
        room.messages.push(chatMessage);
        //adds user to room if not already in -- TODO: Fix to make it so that users can't post nor view if not in chatroom
        if(!room.users.includes(id)){
            console.log("new user")
            room.users.push(id);
        }
        room.save(); //save chatroom updates
        if(adminNames.includes(username)){
            socket.emit('input', {
                name: username+"(Admin)",
                message: message,
                room: req.params.room
            });
        }
        else{
            console.log(username);
            socket.emit('input', {
                name: username,
                message: message,
                room: req.params.room
            });
        }
        //save chat message into database
        chatMessage.save().then(() => { 
            console.log('Chat sent');
            return res.status(200);
        })
    })
})

router.get('/getid', auth.optional, (req, res, next) => {
    var url = req.query.article;
    console.log(url)
    roomId = Room.findOne({ url: url }, (err, room) => {
        return res.json({id: room._id})
        // return res.sendStatus(200).json({id: room._id})
    })
})

/*
//route to join a chatroom
router.post('/:room/join', auth.required, (req, res, next) => {
    Room.findById(req.params.room, (err, room) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        const { payload: { username, id } } = req;
        if (!room.users.includes(id)){
            console.log("new user")
            room.users.push(id);
        }
        room.save();
    })
})
*/

})
module.exports = router;
