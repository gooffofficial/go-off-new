//After you reach the Go Off sign up Pages
document.cookies.get({ domain: 'localhost', name: "authJWT" },
  function (cookie) {
    if (cookie) {
      console.log(cookie.value);
    }
    else {
      console.log('Can\'t get cookie! Check the name!');
    }
});