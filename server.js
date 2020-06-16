const express = require('express'); //express.js
const dotenv = require('dotenv');
dotenv.config();
const cookies = require('cookie-parser')
const flash=require("connect-flash");
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose'); //MongoDB
const client = require('socket.io').listen(4050).sockets; //Socket.io
//const URI = "mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?retryWrites=true&w=majority" //my MongoDB account
const URI = "mongodb://localhost:27017/mongo"
const Chat = require('./models/ChatSchema')
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
app.use(require('./routes'));

mongoose.connect(URI,{useNewUrlParser: true});

var db = mongoose.connection;

app.listen(8000, () => console.log('Server running on http://localhost:8000/'));

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MongoDB connected...');
    //Connect to Socket.io
    client.on('connection', function(socket){
        //create function to send status 
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

        //Handle input events
        socket.on('input', function(data){ //catches things from client 
            let name = data.name;
            let message = data.message;

            //Check for a name and message
            if (name == '' || message == ''){
                //send error status
                sendStatus('Please enter a name and message');
            }else{
                //Insert message to database
                let chatMessage = new Chat({name: name, message: message});
                chatMessage.save().then(function(){
                    client.emit('output', [data]);

                    //Send status object
                    sendStatus({
                        message: 'Message sent', 
                        clear: true
                    });
                });
            }
        });
        //Handle clear
        socket.on('clear', function(data){
            //Remove all chats from the collection
            Chat.deleteMany({}, function(){
                //Emit cleared
                socket.emit('cleared');
            }); 
        });
    });
});