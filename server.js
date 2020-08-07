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
const path = require('path')
//const Users = require('./models/UsersMongo')
const { Users, sequelize } = require('./sequelize')
require('./config/passport')(passport);
//app configuration
const app = express(); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(cookies('shhhhitsasecret'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tutorial', resave: true, saveUninitialized: true }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log(req.hostname);
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });


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

        console.log(socket.request.authCookie);
        //console.log(authCookie);
        var address = socket.handshake.address;
        console.log(address) 
        sendStatus = function(s){
            socket.emit('status', s); //pass from server to client (index.html) use .emit
        }


        socket.on('room', function(room) {
            //Get chats from mongo collection
            Room.findById(room).populate('messages').limit(100).sort({_id:1}).then(chat => { //fetching the chat messages
                //if(err){
                //    throw err;
                //}

                // if (chat.users.length > 5){
                //     newRoom = new Room();
                //     newRoom.save().then(() => {
                //         console.log('joined ' + newRoom._id)
                //         socket.join(newRoom._id);      
                //         socket.emit('output', [{'name': 'server', 'message': 'created new room'}])
                //     })
                // }
                //Emit the messages - display them
                // else{
                    console.log('joined ' + room)
                    socket.join(room);
                    socket.emit('output', chat.messages);
                
                // }
            }).catch(callback => {return callback});
        })
        //const newRoom = new Room(); //create a new chat room (everytime click chrome-extn) in DB - to test schema

        //Handle input events
        socket.on('input', function(data){ //catches things from client 
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
                    client.in(r).emit('output', [data])
    
                        //Send status object
                        sendStatus({
                            message: 'Message sent', 
                            clear: true
                        });
                    /*
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
                    */
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
