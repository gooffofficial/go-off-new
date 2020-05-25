const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('Users');

passport.use(new LocalStrategy({
    usernameField: 'user[username]',
    firstNameField: 'user[firstName]',
    lastNameField: 'user[lastName]',
    passwordField: 'user[password]',
}, (username, firstName, lastName, email, password, done) => {
    Users.findOne({ username }).then((user) => {
        if(!user || !user.validatePassword(password)){
            return done(null, false, {errors: {'email or password': 'is invalid'}});
        }
        
        return done(null, user);
    }).catch(done);
}));