const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
var numRounds = 10

module.exports = (sequelize, type) => {
    var User =  sequelize.define('User', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
            type: type.STRING,
            primaryKey: true
        },
        name: type.STRING,    
        age: type.INTEGER,
        location: type.STRING,
        gender: type.STRING,
        password: type.STRING
    });

    User.prototype.validPassword = function(password){
        return bcrypt.compareSync(password, this.password);
    }
    User.prototype.generateJWT = function(){
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate()+60);
        return jwt.sign({
            username: this.username,
            name: this.name,
            age: this.age,
            location: this.location,
            _id: this._id,
            exp: parseInt(expirationDate.getTime()/1000, 10),
        }, 'secret');
    }
    User.prototype.toAuthJSON = function(){
        return {
            _id: this._id,
            username: this.username,
            name: this.name,
            age: this.age,
            location: this.location,
            email: this.email,
            token: this.generateJWT(),
        };
    }
    User.beforeCreate(function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
      });
    return User;
}