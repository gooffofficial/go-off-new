const roomid = window.location.href.substring(window.location.href.lastIndexOf('/')+1);

//window.onload=function(){setTimeout(openModal,600000)};
var loaded = false;
// Open the Modal
function openModal() {
    document.getElementById("UXlightbox").style.display = "block";
  }
  
  // Close the Modal
  function closeModal() {
    document.getElementById("UXlightbox").style.display = "none";
  }

//keep track of current users
var users = [];
var hold; 
(function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr)
            document.getElementById("username").innerHTML = myArr.user.username + " (you)"; 
            hold = document.getElementById("username");
            console.log(hold);
        }
    };
    xhr.open("GET", '/api/users/current', true); //finds the current user
    //xhr.open("GET", 'http://localhost:8000/api/users/current', true);
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
    var sendBtn = element('send');


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
    //var socket = io.connect('https://go-off.co:2053');
    var socket = io.connect('http://localhost:4050');

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
    
    //insert new messages at the bottom
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    //keep the chat box at the bottom when new messages are sent
    function updateScroll(){
        var element = document.getElementById("card");
            element.scrollTop = element.scrollHeight;
    }
    //Check for connection
    if(socket !== undefined){
        console.log('Connected to socket' + socket.connected);
        //Handle Output 
        socket.on('output', function(data){
            //console.log(data);
            if(loaded == false){
                messages.innerHTML = ''
                loaded = true
            }
            if(data.length){
                for(var x = 0; x < data.length; x++){
                    //Build out message div
                    var message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    names = data[x].name
                    mess = data[x].message

                    //participants
                    if(!users.includes(names)){
                        users.push(names);
                        p = document.createElement('p');
                        p.setAttribute("id", names);
                        p.textContent = names;
                        document.getElementById("participants").appendChild(p);
                    }

                    var para = document.createElement('p');
                    //for name 
                    var spans = document.createElement('span');
                    spans.style.fontWeight = "bold";
                    var nam = document.createTextNode(names);
                    spans.appendChild(nam);
                    //append name to paragraph
                    var col = document.createTextNode(": ");
                    var messa = document.createTextNode(mess);
                    para.appendChild(spans);
                    para.appendChild(col);
                    para.appendChild(messa);
                    var pic = document.createElement('img');
                    pic.setAttribute('src', data[x].propic)
                    pic.style.borderRadius = "50%"

                    message.appendChild(para);
                    message.appendChild(pic);

                    /*
                    temp_time = data[x].createdAt;
                    temp_time = temp_time.split('T')[1]
                    temp_time = temp_time.slice(0,5);
                    //find the EST time from UTC
                    temp_time = temp_time.split(':');
                    hour = parseInt(temp_time[0])
                    if (hour < 4) {
                        hour = 24 - (4 - hour); 
                    }else{
                        hour = hour -4;
                    }
                    //adding am/pm
                    if (hour == 0){
                        time = "12:" + temp_time[1] + "am";
                    }else if (hour == 12){
                        time = hour.toString() + ":" + temp_time[1] + "pm"; 
                    }else if (hour < 12) {
                        time = hour.toString() + ":" + temp_time[1] + "am"
                    }else if(hour > 12) {
                        hour = hour - 12
                        time = hour.toString() + ":" + temp_time[1] + "pm"
                    }
                    
                    */
                    //message.textContent = data[x].name+": "+data[x].message;
                    //message.textContent = /*"(" + time+") "+ */names+": "+mess
                    messages.appendChild(message);
                    insertAfter(message.firstChild,message);
                    
                    //messages.insertBefore(message, messages.firstChild); //makes the most recent message to be on top
                    console.log(messages);
                }
            }
            updateScroll(); 
        });  
        
        //Get Status From Server
        
        socket.on('status', function(data){
            //get message status
            setStatus((typeof data === 'object')? data.message: data);

            //If status is clear, clear text 
            /*
            if(data.clear){
                textarea.value = '';
            }
            */
        });
        
        //Handle a user leaving the room
        socket.on('userLeave', function(data) {
            if(users.includes(data.name)){
                users.splice(users.indexOf(data.name),1);
                var removeName = document.getElementById(data.name);
                removeName.remove();
            }
        })

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
                    
                    xhr.open("POST", "/api/chat/" + roomid, true);
                    //xhr.open("POST", "http://localhost:8000/api/chat/" + roomid, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                    message: textarea.value,
                    }));
                    textarea.value = '';
                    event.preventDefault();
                //});
                
            }
        });
        //Handle Send Button
        sendBtn.addEventListener('click', function(){
            var xhr = new XMLHttpRequest();
            //find id first then do the post request
                    
            xhr.open("POST", "/api/chat/" + roomid, true);
            //xhr.open("POST", "http://localhost:8000/api/chat/" + roomid, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
            message: textarea.value,
            }));
            textarea.value = '';
            event.preventDefault();
        });

        //Clear message
        socket.on('cleared', function(){
            messages.textContent = '';
        });

        //Logout
         var logoff = element('logout');
         logoff.addEventListener('click', function(){
        //     var xhr = new XMLHttpRequest();
        //     xhr.open("GET", "http://localhost:8000/api/users/logout", true);
        //     xhr.send();
            
             window.open('https://go-off.co', '_self')

        //     //window.open('http://localhost:8000/api/users/logout')
        });

        //Go back to home
        var home = element('home');
        home.addEventListener('click', function(){  
            // var url = 'http://go-off.co/profiles/' + username.textContent
            // window.open(url, '_self');
            if(!alert('Please fill out this survey before leaving the conversation! Copy and paste the following link in a new window: https://bostonu.qualtrics.com/jfe/form/SV_1SxxCfIbHjfRDKd/')){var url = 'https://go-off.co/profiles/' + username.textContent
            window.open(url, '_self');}

        });
    }
})();
// chrome.browserAction.setPopup({
//     popup:''
//   });
