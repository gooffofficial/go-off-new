const roomid = window.location.href.substring(window.location.href.lastIndexOf('/')+1);

var hold; 
(function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            document.getElementById("username").innerHTML = myArr.user.name; 
            hold = document.getElementById("username");
            console.log(hold);
        }
    };
    xhr.open("GET", 'http://71.174.243.29:8000/api/users/current', true); //finds the current user
    xhr.send();
    // fetch('http://localhost:8000/api/users/current').then(r => r.text()).then(result => {
    // document.getElementById("username").innerHTML = result.user.name;
    // console.log(result.user.name);
    // hold = document.getElementById("username");
    // console.log('hold', hold);
// })
})();
(function(){

    var element = function(id){
        return document.getElementById(id);
    }
    
    //Get Elements
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    console.log(username.textContent);
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
    var socket = io.connect('http://71.174.243.29:4050');

    //uses the function to find the room
    //var currenturl = 'http://localhost:8000/api/chat/getid?article='
    // setid(function(roomnum){
        socket.emit('room', roomid)
        console.log('socketis emitted');
    // });

    //function to find the chatroom id 
    function setid(callback){
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url; //checks the current tab url
            console.log(url);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var idnum = JSON.parse(this.responseText);
                // console.log('the idnum set to', idnum.id);
                // socket.emit('room', idnum.id); //sets the room to that idnum returned
                
                if(callback) callback(idnum.id);
            }
        };
            xhr.open("GET", currenturl+ url, true);
            xhr.send();
        
        });
        }
 
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
                    console.log(messages);
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
                    name: username.textContent,
                    message: textarea.value
                });
                */
                //var currenturl = 'http://localhost:8000/api/chat/getid?article='
                //setid(currenturl, function(roomnum){ //uses the function to look for the id
                    var xhr = new XMLHttpRequest();
                    //find id first then do the post request
                    
                    xhr.open("POST", "http://71.174.243.29:8000/api/chat/" + roomid, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                    message: textarea.value,
                    }));
                    textarea.value = '';
                    event.preventDefault();
                //});
                
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

        //Logout
        var logoff = element('logout');
        logoff.addEventListener('click', function(){
            window.open('http://71.174.243.29:8000/api/users/logout')
        });
    }
})();
chrome.browserAction.setPopup({
    popup:''
  });
