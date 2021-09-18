//var port   =   chrome.runtime.connect({name: "popup-port"});
// chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     let url = tabs[0].url; //checks the current tab url
//     console.log(url);
//     port.postMessage({is_url: url})
// });



//leads you to signup page if not logged in, chat otherwise
let chat = document.getElementById('letschat');
let logins = chrome.extension.getURL("test_login.html");
let chatpage = chrome.extension.getURL("index.html")

chat.onclick = function() {
    fetch("http://localhost:8000/api/users/current").then(function(response){
        if(response.status==200){
            chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
                let url = tabs[0].url;
                console.log('the url is', url);
                if (url == 'https://www.google.com/'){
                    console.log('the url is googles');
                    chrome.windows.create({
                        url: "http://gooffbetadocker1-env.eba-tnmaygqs.us-west-1.elasticbeanstalk.com/chat/5f18b2063f900a9eb4c29ed2",
                        type: "popup", 
                        focused: true
                    });
                }
                else if (url == 'https://www.wsj.com/articles/microsoft-and-bytedance-put-tiktok-talks-on-hold-after-trump-signals-opposition-11596312611?mod=hp_lead_pos1'){
                    console.log('the url is wsj');
                    chrome.windows.create({
                        url: "http://gooffbetadocker1-env.eba-tnmaygqs.us-west-1.elasticbeanstalk.com/chat/5f177e384488047e8826d74d",
                        type: "popup", 
                        focused: true
                    });
                }
                else{
                    console.log('invalid url');
                }
            });
     
        }
        else{
            window.open(logins);
            //open http://gooffbetadocker1-env.eba-tnmaygqs.us-west-1.elasticbeanstalk.com to login
            //window.open('http://gooffbetadocker1-env.eba-tnmaygqs.us-west-1.elasticbeanstalk.com')
        }
    });
      
}
