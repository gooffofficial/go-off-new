//leads you to the "Go Off" sign up pages

let loginpage = document.getElementById('login');
let signuppage = document.getElementById('signup');
let signs = chrome.extension.getURL("test_signup.html");
let logins = chrome.extension.getURL("test_login.html");
signuppage.onclick = function() {
      window.open(signs);
  };
loginpage.onclick = function(){
  window.open(logins);
};

chrome.browserAction.setPopup({
  popup:''
});