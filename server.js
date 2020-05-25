const express = require('express'); //express.js
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose'); //MongoDB
const client = require('socket.io').listen(4050).sockets; //Socket.io
//const URI = "mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?retryWrites=true&w=majority" //my MongoDB account
const URI = "mongodb://localhost:27017/mongo"
const Chat = require('./models/ChatSchema')
const Users = require('./models/Users')
require('./config/passport');
//app configuration
const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
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

/*
//Connect to MongoDB - the :// part created a database
mongo.connect(URI, { useUnifiedTopology: true } ,function(err, db2){ //connect to MongoDB
    if(err){
        throw err;
    }
    console.log('MongoDB connected...');
    let db = db2.db('mongo');
    //Connect to Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');

        //create function to send status 
        sendStatus = function(s){
            socket.emit('status', s); //pass from server to client (index.html) use .emit
        }

        //Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){ //fetching the chat messages
            if(err){
                throw err;
            }

            //Emit the messages - display them
            socket.emit('output', res);
        });

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
                chat.insertOne({name: name, message:message}, function(){
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
            chat.deleteMany({}, function(){
                //Emit cleared
                socket.emit('cleared');
            }); 
        });
    });
});
*/