# go-off

Hey team, welcome to our codebase!

Just to avoid as many merge conflicts as possible, when you work on a new feature
do your work on a new branch with the feature you are working on as its name.

For example, if I were working on a user page the branch I would working on is "user-page".

Once you have your feature working, submit a pull request so that we can merge the code!

# running the servers
To run the website on localhost correctly you need to run the Node, React and Flask servers concurrently

React  
"Cd client"  
To install dependencies on first run through run "npm install"  
To run server run "npm start"  

Flask  
Clone the gooff-flask repo and work in the Docker branch: https://github.com/sakethgangam/gooff-flask 
"Cd flask-app"  
To install dependencies on first run through run "pip install -r requirements.txt"  
to run server run "Python main.py"  

If you are on mac this server may give you issues with the dependency installation step if this is the case follow the instructions below:   
Install the most recent conda package in this link: https://whiteboxml.com/blog/the-definitive-guide-to-python-virtual-environments-with-conda  
Then follow these steps in order:   
“Conda create —name py38 python=3.8”  
“Conda activate py38”  
"brew doctor"  
"brew cleanup"  
"Brew install mysql"  
Inside requirements.txt change “psycopg==2.9.1” to “psycopg2-binary” and save  
“pip3 uninstall mysql-connector”  
“pip install -r requirements.txt”  

Node  
This will also be in the gooff-flask repo  
"Cd node-app"  
To install dependencies on first run through run "npm install"  
to run server run "node server.js"  
