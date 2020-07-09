const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
var numRounds = 10

module.exports = (sequelize, type) => {
    var User =  sequelize.define('User', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        username: {
            type: type.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Email not valid"
                },
            }
        },
        name: type.STRING,    
        age: type.INTEGER,
        location: type.STRING,
        gender: type.STRING,
        password: {
            type: type.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8,64],
                    msg: "Password not valid"
                }
            }
        }
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
            email: this.email,
            name: this.name,
            age: this.age,
            location: this.location,
            id: this.id,
            exp: parseInt(expirationDate.getTime()/1000, 10),
        }, 'secret');
    }
    User.prototype.toAuthJSON = function(){
        return {
            id: this.id,
            username: this.username,
            name: this.name,
            age: this.age,
            location: this.location,
            email: this.email,
            token: this.generateJWT(),
        };
    }
    User.prototype.getUserInfo = function(){
        return {
            username: this.username,
            email: this.email,
            name: this.name,
            age: this.age,
            location: this.location,
            email: this.email,
        }
    }
    User.prototype.getProfile = function(){
        return{
            //need to add propic, bio, etc
            username: this.username,
            name: this.name,
            location: this.location,
        }
    }
    User.beforeCreate(function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    User.beforeUpdate(function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    return User;
}