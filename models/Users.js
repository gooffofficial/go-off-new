//User Schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
var numRounds = 10;

const UsersSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    hash: String,
    salt: String
})

UsersSchema.methods.setPassword = function(password){
    this.salt = bcrypt.genSaltSync(numRounds);
    this.hash = bcrypt.hashSync(password, this.salt);
};

UsersSchema.methods.validatePassword = function(password){
    const hash = bcrypt.hashSync(password, this.salt);
    return hash === this.hash;
};

UsersSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate()+60);
    return jwt.sign({
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        _id: this._id,
        exp: parseInt(expirationDate.getTime()/1000, 10),
    }, 'secret');
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        token: this.generateJWT(),
    };
};

mongoose.model('Users', UsersSchema)