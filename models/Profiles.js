const jwt = require('jsonwebtoken');
const User = require('./Users')
/*
article1title: "2020 Presidential Debate",
        article1img: 'https://static01.nyt.com/images/2020/09/30/multimedia/30elections-briefing-debates3/merlin_177807387_607b7b41-4fa3-438d-8a63-2daf4b7a899c-superJumbo.jpg?quality=90&auto=webp',
        article1author: '',
        article1link: 'https://www.nytimes.com/live/2020/09/30/us/presidential-debate'
*/
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
        Posts: {
            type: type.INTEGER,
            defaultValue: 0
        },    
        ppic: {
            type: type.STRING,
            defaultValue: "https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"
        },
        bio: type.STRING,
        article1img: {
            type: type.STRING,
            defaultValue: 'https://static01.nyt.com/images/2020/09/30/multimedia/30elections-briefing-debates3/merlin_177807387_607b7b41-4fa3-438d-8a63-2daf4b7a899c-superJumbo.jpg?quality=90&auto=webp'
        },
        article1link: {
            type: type.STRING,
            defaultValue: 'https://www.nytimes.com/live/2020/09/30/us/presidential-debate'
        },
        article1author: {
            type: type.STRING,
            defaultValue: ""
        },
        article1title: {
            type: type.STRING,
            defaultValue: "2020 Presidential Debate"
        },
        article1readtime: type.STRING,
        article2img: {
            type: type.STRING,
            defaultValue: "https://www.incimages.com/uploaded_files/image/1920x1080/getty_1052797860_20001333200092800_441645.jpg"
        },
        article2link: {
            type: type.STRING,
            defaultValue: "https://www.inc.com/justin-bariso/intelligent-minds-like-tim-cook-jeff-bezos-embrace-rule-of-awkward-silence-you-should-too.html"
        },
        article2author: {
            type: type.STRING,
            defaultValue: "Justin Bariso"
        },
        article2title: {
            type: type.STRING,
            defaultValue: "Intelligent Minds Like Tim Cook and Jeff Bezos Embrace the Rule of Awkward Silence. You Should Too"
        },
        article2readtime: type.STRING,
        article3img: {
            type: type.STRING,
            defaultValue: "https://static01.nyt.com/vi-assets/images/share/1200x675_nameplate.png"
        },
        article3link: {
            type: type.STRING,
            defaultValue: "https://www.nytimes.com/interactive/2017/climate/what-is-climate-change.html"
        },
        article3author: {
            type: type.STRING,
            defaultValue: "Justin Gillis"
        },
        article3title: {
            type: type.STRING,
            defaultValue: "Climate Change is Complex. We've Got Answers to Your Questions."
        },
        article3readtime: type.STRING,
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
            Posts: this.Posts,
            article1img: this.article1img,
            article1link: this.article1link,
            article1author: this.article1author,
            article1title: this.article1title,
            article1readtime: this.article1readtime,
            article2img: this.article2img,
            article2link: this.article2link,
            article2author: this.article2author,
            article2title: this.article2title,
            article2readtime: this.article2readtime,
            article3img: this.article3img,
            article3link: this.article3link,
            article3author: this.article3author,
            article3title: this.article3title,
            article3readtime: this.article3readtime,
         }
    }
    return Profile;
}