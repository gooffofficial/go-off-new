(function(){
    var element = function(id){
        return document.getElementById(id);
    }

    //Get Elements
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearBtn = element('clear');

    //Set default status
    var statusDefault = status.textContent;

    var setStatus = function(s){
        //set status
        status.textContent = s;

        if(s !== statusDefault){
            var delay = setTimeout(function(){
                setStatus(statusDefault);
            },4000); //setTimeout takes time in ms
        }
    }
    //Connect to socket.io
    //Make sure IP address is the IP of the server
    var socket = io.connect('http://localhost:4050');

    socket.emit('room', 'test2');

    //Check for connection
    if(socket !== undefined){
        console.log('Connected to socket');
        //Handle Output 
        socket.on('output', function(data){
            console.log(data);
            if(data.length){
                for(var x = 0; x < data.length; x++){
                    //Build out message div
                    var message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.textContent = data[x].name+": "+data[x].message;

                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild); //makes the most recent message to be on top
                }
            }
        });  
        
        //Get Status From Server
        socket.on('status', function(data){
            //get message status
            setStatus((typeof data === 'object')? data.message: data);

            //If status is clear, clear text 
            if(data.clear){
                textarea.value = '';
            }
        });

        //Handle Input
        textarea.addEventListener('keydown', function(event){
            if(event.which === 13 && event.shiftKey == false){
                /*
                //Emit to server input
                socket.emit('input', {
                    name: username.value,
                    message: textarea.value
                });
                */
                var xhr = new XMLHttpRequest();
                //console.log(xhr)
                xhr.open("POST", "http://localhost:8000/api/chat/test2", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                   message: textarea.value,
                }));
                textarea.value = '';
                event.preventDefault();
            }
        });

        //Handle Chat Clear
        clearBtn.addEventListener('click', function(){
            socket.emit('clear');
        });

        //Clear message
        socket.on('cleared', function(){
            messages.textContent = '';
        });
    }
})();