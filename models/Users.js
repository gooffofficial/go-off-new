const sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Profile = require('./Profiles')
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
        firstname: type.STRING,
        lastname: type.STRING,    
        age: type.INTEGER,
        location: type.STRING,
        gender: type.STRING,
        admin: type.STRING,
        followercount: type.INTEGER,
        followingcount: type.INTEGER,
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
    }/*,
    {
        classMethods: {
            associate: function(models){
                console.log(models)
                User.hasOne(models.Profile, { constraints: false })
            }
        }
    }*/)
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
            followingcount: this.followingcount,
            followercount: this.followercount,
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
            followingcount: this.followingcount,
            followercount: this.followercount,
            token: this.generateJWT(),
        };
    }

    User.prototype.getUserId = function(){
        return {
            id:this.id
        }
    }
    User.prototype.getUserInfo = function(){
        return {
            username: this.username,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname,
            name: this.name,
            age: this.age,
            location: this.location,
            email: this.email,
            admin: this.admin,
            followingcount: this.followingcount,
            followercount: this.followercount,
        }
    }
    /*
    User.prototype.getProfileInfo = function(){
        db.Profiles.findOne({
            where: { UserId: this.id }
        }).then((profile) => {
            return{
                //need to add propic, bio, etc
                username: this.username,
                name: this.name,
                location: this.location,
                profileInfo: profile,
                propic: profile.ppic,
                bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
                followercount: 0,
                followingcount: 0,
                news: ['https://www.nytimes.com/2020/07/12/world/coronavirus-updates.html?action=click&module=Top%20Stories&pgtype=Homepage', 'https://www.washingtonpost.com/world/2020/07/11/bolsonaro-coronavirus-video-timeline/?arc404=true', 'https://theathletic.com/1923630/2020/07/12/the-unique-nature-of-the-nhls-return-to-play-is-a-stage-where-coaches-can-shine/']
            }
        })
    }
    */
    User.beforeCreate(function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    User.beforeUpdate(function(user) {
        if (user.changed('password')){
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        }
    });
    //User.associate = function(models) {
    //    User.hasOne(models.Profiles);
    //}
    return User;
}