# go-off

Hey team, welcome to our codebase!

Just to avoid as many merge conflicts as possible, when you work on a new feature
do your work on a new branch with the feature you are working on as its name.

For example, if I were working on a user page the branch I would working on is "user-page".

Once you have your feature working, submit a pull request so that we can merge the code!

# running the backend server

To get the server working, install mongodb locally (we are running it locally for testing purposes), and run the mongo server.
Install node dependencies with 'yarn install package', then run the server with 'node server.js'.

# user account stuff

To register a new user: send a post request to localhost:8000 with a json formatted like this within the body:
```
{
    "user": {
        "_id": "5ecc59162f4bb86609d8773c",
        "username": "testUser2",
        "firstName": "John",
        "lastName": "Smith",
        "email": "jsmitty@gmail.com",
        "password": "1234"
    }
}
```
