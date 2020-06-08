# go-off

Hey team, welcome to our codebase!

Just to avoid as many merge conflicts as possible, when you work on a new feature
do your work on a new branch with the feature you are working on as its name.

For example, if I were working on a user page the branch I would working on is "user-page".

Once you have your feature working, submit a pull request so that we can merge the code!

# running the backend server

To get the server working, install mongodb locally (we are running it locally for testing purposes), and run the mongo server.
Install node dependencies with 'yarn install package', then run the server with 'node server.js'.

Make sure to download the .env folder with all the sensitive AWS folder if you haven't already. 

# user account stuff

To register a new user: send a post request to localhost:8000/api/users with a form containing the following info:
```
username
firstName
lastName
age
location
email
password
```

Logging in only requires username and password (also in a form) posted to localhost:8000/api/users/login

# authorization

After logging in, there should be a cookie stored in your browser called AuthJWT, this token is sent along with every request to the server to verify that you are logged in properly and gives access to routes that require you to be authenticated in. As of right now this only includes localhost:8000/api/users/current which will just return a json of the user info. I made simple html files for reigstering and logging in if you want to test it out.
