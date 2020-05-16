const mongo = require('mongodb').MongoClient; //MongoDB
const client = require('socket.io').listen(4000).sockets; //Socket.io
const URI = "mongodb+srv://steph:steph@cluster0-uymqk.mongodb.net/test?retryWrites=true&w=majority" //my MongoDB account

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
