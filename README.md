# go-off

Hey team, welcome to our codebase!

Just to avoid as many merge conflicts as possible, when you work on a new feature
do your work on a new branch with the feature you are working on as its name.

For example, if I were working on a user page the branch I would working on is "user-page".

Once you have your feature working, submit a pull request so that we can merge the code!

# Docker and deployment

We are deploying our application via docker images so that we can easily control our environment and ensure that we have all the dependencies that we need installed for multiple programming languages at one (i.e. JS and Python).

I set up a dockerhub repository that automatically triggers a new build each time a change is pushed to the master branch of the github repo. It is crucial that master only contains working code because of this!

When you push a change to the master branch, you can log in to hub.docker.com with our Go Off! account info to see the build progress. To see this, go to the gooff repo on dockerhub, and click on 'Builds', and scroll down to 'Automated Builds' to see the progress.

After the build is finished, go to AWS, and to our elastic beanstalk environment (GooffBetaDocker1-env). From there, click upload and deploy and upload to Dockerrun.aws.json file which you were provided. When it is done deploying, then you should be able to access the site and see the changes!

If something goes wrong in deployment, the logs are probably the first place you should go. You can find them on the left side of the elastic beanstalk page, and clicking on Logs. Usually getting the last 100 lines will be good enough, but if not, you also have the option to download the full logs.

If you need to add something to the environment variables. Updating .env will not be enough as we are not pushing that file to the github repo. You will adlso need to add it into the build configurations on Dockerhub. Once you are in the dockerhub repo, go to builds, then configure automated builds, then add a build environment variable.

# running the backend server

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
