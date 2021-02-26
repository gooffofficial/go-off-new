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
router.post('/:room', auth.required, [
    body('message').escape()
],(req, res, next) => {
    Room.findById(req.params.room, (err, room) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        const { payload: { username, id }} = req;
        const message = req.body.message;
        //create message object
        let chatMessage = new Chat({user: id, name: username, message: message});
        //only allow messages if chat is not ended
        if(room.status != true){
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
                    room: req.params.room,
                    user: id
                });
            }
            else{
                console.log(username);
                socket.emit('input', {
                    name: username,
                    message: message,
                    room: req.params.room,
                    user: id
                });
            }
            //save chat message into database
            chatMessage.save().then(() => { 
                console.log('Chat sent');
                return res.status(200);
            })
        }
        else{
            return res.status(202)
        }
    })
})

router.post('/m/:room', auth.required, [
    body('message').escape()
], (req, res, next) => {
    DM.findOne({identifier: req.params.room}, (err, room) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        const { payload: { username, id }} = req;
        if(!room){
           
            var nameUser = req.params.room.replace(username,'');
            console.log(nameUser, 'usernamee of person')
            db.User.findOne({
                where: {
                    username: nameUser
                }
            }).then((use)=>{
                room = new DM({identifier: req.params.room, users: [use.id, id]});
                const message = req.body.message;
                //create message object
                let chatMessage = new Chat({user: id, name: username, message: message});
                //only allow messages if chat is not ended
                if(room.status != true){
                    room.messages.push(chatMessage);
                    //adds user to room if not already in -- TODO: Fix to make it so that users can't post nor view if not in chatroom
                    if(!room.users.includes(id)){
                        console.log("new user \n\n\n\n", id)
                        room.users.push(id);
                    }
                    room.save(); //save chatroom updates
                    console.log(username);
                    socket.emit('input', {
                        name: username,
                        message: message,
                        room: req.params.room,
                        user: id
                    });
                    //save chat message into database
                    chatMessage.save().then(() => { 
                        console.log('Chat sent');
                        return res.status(200);
                    })
                }
                else{
                    return res.status(202)
                }
            });
        } else{
        const message = req.body.message;
        //create message object
        let chatMessage = new Chat({user: id, name: username, message: message});
        //only allow messages if chat is not ended
        if(room.status != true){
            room.messages.push(chatMessage);
            //adds user to room if not already in -- TODO: Fix to make it so that users can't post nor view if not in chatroom
            if(!room.users.includes(id)){
                console.log("new user \n\n\n\n", id)
                room.users.push(id);
            }
            room.save(); //save chatroom updates
            console.log(username);
            socket.emit('input', {
                name: username,
                message: message,
                room: req.params.room,
                user: id
            });
            //save chat message into database
            chatMessage.save().then(() => { 
                console.log('Chat sent');
                return res.status(200);
            })
        }
        else{
            return res.status(202)
        }
    }
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

//route for user to leave conversation
router.post('/leave/:roomid', auth.required, (req, res, next) => {
    const { payload: {id, username} } = req;
    var roomId = req.params.roomid;
    Room.findById(roomId, (err, room) => {
        if(err){
            console.log(err);
            res.send(err);
        }
        socket.emit('leave', {
            name: username,
            room: roomId,
            user: id
        });
        // socket.in(roomId).emit('userBye', {
        //     bye: username + ' has left.'
        // });
        room.users.pull(id);
        room.save().then(() => {
            return res.redirect('/profiles/'+username)
        })
    })
})

//route to end conversation
router.post('/end/:roomid', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    var roomid = req.params.roomid;
    db.User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        db.Convo.findOne({
            where: {
                RoomId: req.params.roomid
            }
        }).then((convo) => {
            if(user.admin != "(Admin)" && id != convo.host){
                return res.sendStatus(403);
            }
            else{
                Room.findById(roomid, (err, room) => {
                    if(err){
                        console.log(err);
                        return res.send(err);
                    }
                    const { payload: { id } } = req;
                    db.User.findOne({
                        where: {
                            id: id
                        }
                    }).then((user) => {
                        if (user.admin != "(Admin)"){
                            return res.sendStatus(403);
                        }
                        else{
                            room.status = true;
                            room.save().then(() => {
                                return res.redirect('/chat/'+roomid);
                            })
                        }
                    })
                })
            }
        })
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
