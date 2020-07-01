const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')
const Chat = require('../../models/ChatSchema')
const logger = require('../../logger')
const io = require('socket.io-client')
const _ = require('lodash')


var socket = io.connect('http://127.0.0.1:4050');

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

router.post('/:room', auth.required, (req, res, next) => {
    const { payload: { username }} = req;
    const message = req.body.message;
    socket.emit('input', {
        name: username,
        message: message,
        room: req.params.room
    });
    console.log('Chat sent');
    return res.status(200);
})

module.exports = router;