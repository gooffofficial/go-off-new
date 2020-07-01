const express = require('express'); //express.js
const dotenv = require('dotenv');
const jwt = require('express-jwt');
dotenv.config();
const cookie = require('cookie');
const cookies = require('cookie-parser')
const flash=require("connect-flash");
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose'); //MongoDB
const client = require('socket.io').listen(4050).sockets; //Socket.io
const URI = "mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?retryWrites=true&w=majority" //my MongoDB account
//const URI = "mongodb://localhost:27017/mongo"
const Chat = require('./models/ChatSchema')
const Room = require('./models/RoomSchema') //Test Rooms
const passport = require('passport')
//const Users = require('./models/UsersMongo')
const { Users, sequelize } = require('./sequelize')
require('./config/passport')(passport);
//app configuration
const app = express(); 

app.use(flash());
app.use(cookies('shhhhitsasecret'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tutorial', resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(URI,{useNewUrlParser: true});

var db = mongoose.connection;

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MongoDB connected...');
    //Connect to Socket.io
    client.on('connection', function(socket){
        //get jwt from request cookies to authenticate user
        reqCookies = cookie.parse(socket.request.headers.cookie || '');
        authCookie = reqCookies.authJWT;

        console.log(authCookie);
        //console.log(authCookie);
        var address = socket.handshake.address;
        console.log(address) 
        sendStatus = function(s){
            socket.emit('status', s); //pass from server to client (index.html) use .emit
        }

        //Get chats from mongo collection
        Chat.find().limit(100).sort({_id:1}).then(chat => { //fetching the chat messages
            //if(err){
            //    throw err;
            //}

            //Emit the messages - display them
            socket.emit('output', chat);
        }).catch(callback => {return callback});

        socket.on('room', function(room) {
            console.log('joined ' + room)
            socket.join(room);
        })
        const newRoom = new Room(); //create a new chat room (everytime click chrome-extn) in DB - to test schema
        //Handle input events
        socket.on('input', function(data){ //catches things from client 
            // let name = data.name;
            // let message = data.message;
            
            // //unable to fetch information about the user such as location/age

            // //Check for a name and message
            // if (name == '' || message == ''){
            //     //send error status
            //     sendStatus('Please enter a name and message');
            // }else{
            //     //Insert message to database
            //     let chatMessage = new Chat({name: name, message: message, room: newRoom._id});
            //     chatMessage.save().then(function(){
            //         client.emit('output', [data]);
            //         newRoom.messages.push(chatMessage);
            //         newRoom.users.push(name);
            //         newRoom.save();
            //         //Send status object
            //         sendStatus({
            //             message: 'Message sent', 
            //             clear: true
            if(address == '::ffff:127.0.0.1'){ //ensure that only the express server can send messages directly
                let name = data.name;
                let message = data.message;
                let r = data.room;
                //Check for a name and message
                if (name == '' || message == ''){
                    //send error status
                    sendStatus('Please enter a name and message');
                }else{
                    //Insert message to database
                    console.log(r);
                    let chatMessage = new Chat({name: name, message: message});
                    chatMessage.save().then(function(){
                        //after saving message, emit to all clients connected to that room
                        client.in(r).emit('output', [data])
    
                        //Send status object
                        sendStatus({
                            message: 'Message sent', 
                            clear: true
                        });
                    });
                }
            }
            else{
                sendStatus({
                    message: 'Your source is not authorized to send messages'
                })
            }
        });
        //Handle clear
        socket.on('clear', function(data){
            //Remove all chats from the collection
            Chat.deleteMany({}, function(){
                //ROOMS are not DELETED
                //Emit cleared
                socket.emit('cleared');
            }); 
            
        });
    });
    app.use(require('./routes'));
});