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
    xhr.open("GET", 'http://localhost:8000/api/users/current', true);
    xhr.send();
    // fetch('http://localhost:8000/api/users/current').then(r => r.text()).then(result => {
    // document.getElementById("username").innerHTML = result.user.name;
    // console.log(result.user.name);
    // hold = document.getElementById("username");
    // console.log('hold', hold);
// })
})();
(function(){
    // var xhr = new XMLHttpRequest();
   
    // xhr.open("GET", chrome.extension.getURL('name.json'), true);
    // myArr = JSON.parse(this.responseText);
    // console.log(myArr.name);
    // xhr.send();

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
    var socket = io.connect('http://127.0.0.1:4050'); 

    //Check for connection
    if(socket !== undefined){
        console.log('Connected to socket');
        //Handle Output 
        socket.on('output', function(data){
            //console.log(data);
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
                //Emit to server input
                socket.emit('input', {
                    name: username.textContent,
                    message: textarea.value
                });
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

        //Logout
        var logoff = element('logout');
        logoff.addEventListener('click', function(){
            window.open('http://localhost:8000/api/users/logout')
        });
    }
})();
chrome.browserAction.setPopup({
    popup:''
  });
