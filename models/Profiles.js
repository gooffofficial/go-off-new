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
            defaultValue: 'https://cdn.cnn.com/cnnnext/dam/assets/201030082605-04-trump-biden-election-night-split-super-tease.jpg'
        },
        article1link: {
            type: type.STRING,
            defaultValue: 'https://www.cnn.com/politics/live-news/us-election-news-11-02-2020/index.html'
        },
        article1author: {
            type: type.STRING,
            defaultValue: "CNN"
        },
        article1title: {
            type: type.STRING,
            defaultValue: "It's the day before Election Day"
        },
        article1readtime: type.STRING,
        article2img: {
            type: type.STRING,
            defaultValue: "https://dailyfreepress.com/wp-content/uploads/image1-27-431x288.jpg"
        },
        article2link: {
            type: type.STRING,
            defaultValue: "https://dailyfreepress.com/2020/10/22/restaurants-brace-for-cold-weather-after-summer-of-outdoor-dining/"
        },
        article2author: {
            type: type.STRING,
            defaultValue: "Daniel Kool"
        },
        article2title: {
            type: type.STRING,
            defaultValue: "DFP | Restaurants brace for winter"
        },
        article2readtime: type.STRING,
        article3img: {
            type: type.STRING,
            defaultValue: "https://www.greentechmedia.com/assets/content/cache/made/assets/content/cache/remote/https_assets.greentechmedia.com/content/images/articles/Charging_EVs_Infrastructure_XL_500_281_80.jpg"
        },
        article3link: {
            type: type.STRING,
            defaultValue: "https://www.greentechmedia.com/articles/read/how-european-evs-are-balancing-out-the-renewables-that-power-them"
        },
        article3author: {
            type: type.STRING,
            defaultValue: "John Parnell"
        },
        article3title: {
            type: type.STRING,
            defaultValue: "The Startup Helping EVs Balance Out the Renewables That Power Them"
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