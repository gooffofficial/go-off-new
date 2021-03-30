const Articles = require("./Articles");

module.exports = (sequelize, type) => {
    var TrendingArticle = sequelize.define('TrendingArticle', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        article1: type.STRING,
        article2: type.STRING,
        article3: type.STRING,
        article4: type.STRING
    });

    TrendingArticle.prototype.getTArticleInfo = function(){
        return {
            article1: type.STRING,
            article2: type.STRING,
            article3: type.STRING,
            article4: type.STRING
        }
    }
    return TrendingArticle;
}