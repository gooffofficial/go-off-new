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
'''
{
    "user": {
        "_id": "5ecc59162f4bb86609d8773c",
        "username": "testUser2",
        "firstName": "John",
        "lastName": "Smith",
        "email": "jsmitty@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyMiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNtaXRoIiwiZW1haWwiOiJqc21pdHR5QGdtYWlsLmNvbSIsIl9pZCI6IjVlY2M1OTE2MmY0YmI4NjYwOWQ4NzczYyIsImV4cCI6MTU5NTYzNDQ1NCwiaWF0IjoxNTkwNDUwNDU0fQ.w8yMMC_83hkuoU99lTVqiX9fL7OU29xiS1IUMa3rsWU"
    }
}
'''