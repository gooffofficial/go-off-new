const Articles = require("./Articles");

module.exports = (sequelize, type) => {
    var UserArticle =  sequelize.define('UserArticle', {
        UserId: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        article1: type.STRING,
        article2: type.STRING,  
        article3: type.STRING,
        article4: type.STRING
    });
    
    UserArticle.prototype.getArticles = function(){
        return {
            article1: this.article1,
            article2: this.article2,
            article3: this.article3,
            article4: this.article4
         }
    }
    return UserArticle;
}