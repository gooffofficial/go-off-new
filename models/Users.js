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
            propic: 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg',
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
            followers: 0,
            following: 0,
            news: ['https://www.nytimes.com/2020/07/12/world/coronavirus-updates.html?action=click&module=Top%20Stories&pgtype=Homepage', 'https://www.washingtonpost.com/world/2020/07/11/bolsonaro-coronavirus-video-timeline/?arc404=true', 'https://theathletic.com/1923630/2020/07/12/the-unique-nature-of-the-nhls-return-to-play-is-a-stage-where-coaches-can-shine/']
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