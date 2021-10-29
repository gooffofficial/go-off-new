//const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
var db = require("../models");
//const Users = mongoose.model('Users');


module.exports = function(passport){

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        
        console.log('hello!')
        db.User.findOne({where:{username:username}}).then((user) => {
            if(user){
                done(null, user.get());
            }
            else{
                done(user.errors, null);
            }
        })
        
    }); 
    
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        //passReqToCallback : true
    }, (username, password, done) => {
        db.User.findOne({ 
            where: {
            username: username
        } }).then((user) => {
            if(!user || !user.validPassword(password)){
                return done(null, false, {errors: {'username or password': 'is invalid'}});
            }
            
            return done(null, user);
        }).catch(done);
    }));
}