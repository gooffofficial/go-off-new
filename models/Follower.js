const jwt = require('jsonwebtoken');
const User = require('./Users')

module.exports = (sequelize, type) => {
    var Follower =  sequelize.define('Follower', {
        follower: {
            type: type.INTEGER,
            defaultValue: 0
        },  
        followed  : {
            type: type.INTEGER,
            defaultValue: 0
        }
    });

    Follower.prototype.getFollowerInfo = function(){
        return {
            follower: this.follower,
            followed: this.followed
         }
    }
    return Follower;
}