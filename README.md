# go-off-new

Hey team, welcome to our codebase!

Just to avoid as many merge conflicts as possible, when you work on a new feature
do your work on a new branch with the feature you are working on as its name.

For example, if I were working on a user page the branch I would working on is "user-page".

Once you have your feature working, submit a pull request so that we can merge the code!

# running the backend server

Install node dependencies with 'yarn add package', then run the server with 'node server.js'.

Make sure to download the .env folder with all the sensitive AWS folder if you haven't already. 

# Docker and deployment

We are deploying our application via docker images so that we can easily control our environment and ensure that we have all the dependencies that we need installed for multiple programming languages at one (i.e. JS and Python).

I set up a dockerhub repository which AWS will grab our image from. See details at hub.docker.com and login in with our Go Off! account info.

To build and deploy first you want to install docker. After docker is installed, then run 'docker login' and login with the Go Off docker credentials.

1. In the client folder of the Go Off repository run yarn run build
2. In the the root folder of the Go Off repository run "docker build -t gooffofficial/go-off-back ."
3. After that build is complete run "docker push gooffofficial/go-off-back"

Note: This is via the terminal. I don't know how docker desktop works, so if you do it through that I'm not sure the entire process.

After the build is finished, go to AWS, and to our elastic beanstalk environment (GooffBetaDocker1-env). From there, click upload and deploy and upload to Dockerrun.aws.back.json file which you were provided. When it is done deploying, then you should be able to access the site and see the changes!

If something goes wrong in deployment, the logs are probably the first place you should go. You can find them on the left side of the elastic beanstalk page, and clicking on Logs. Usually getting the last 100 lines will be good enough, but if not, you also have the option to download the full logs.

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
