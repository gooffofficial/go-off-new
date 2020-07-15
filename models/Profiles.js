const jwt = require('jsonwebtoken');
const User = require('./Users')

module.exports = (sequelize, type) => {
    var Profile =  sequelize.define('Profile', {
        followers: {
            type: type.INTEGER,
            defaultValue: 0,
        },
        following: {
            type: type.INTEGER,
            defaultValue: 0,
        },    
        ppic: {
            type: type.STRING,
            defaultValue: "https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"
        },
        bio: type.STRING,
        article1img: type.STRING,
        article1link: type.STRING,
        article1author: type.STRING,
        article1title: type.STRING,
        article1readtime: type.DATE,
        article2img: type.STRING,
        article2link: type.STRING,
        article2author: type.STRING,
        article2title: type.STRING,
        article2readtime: type.DATE,
        article3img: type.STRING,
        article3link: type.STRING,
        article3author: type.STRING,
        article3title: type.STRING,
        article3readtime: type.DATE,
        UserId: type.INTEGER
    }/*,
    {
        classMethods: {
            associate: function(models){
                Profile.belongsTo(models.User);
            }
        }
    }*/);
    //Profile.associate = function(models) {
    //    Profile.belongsTo(models.Users);
    //}
    Profile.prototype.getProfileInfo = function(){
        return {
            followers: this.followers,
            following: this.following,
            propic: this.ppic,
            bio: this.bio,
            article1img: this.article1img,
            article1link: this.article1link,
            article1author: this.article1author,
            article1title: this.article1title,
            article1readTime: this.article1readTime,
            article2img: this.article2img,
            article2link: this.article2link,
            article2author: this.article2author,
            article2title: this.article2title,
            article2readTime: this.article2readTime,
            article3img: this.article3img,
            article3link: this.article3link,
            article3author: this.article3author,
            article3title: this.article3title,
            article3readTime: this.article3readTime,
         }
    }
    return Profile;
}