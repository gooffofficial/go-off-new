chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

chrome.browserAction.onClicked.addListener(function(tab){
  console.log('clicked');
  fetch("http://localhost:8000/api/users/current").then(function(response){
    if(response.status==200){
      chrome.browserAction.setPopup({
        popup:"index.html"
      });
      console.log('indexset');
    }
    else{
      chrome.browserAction.setPopup({
        popup:"popup.html"
      });
      console.log('popupset');
    }
  });
});
