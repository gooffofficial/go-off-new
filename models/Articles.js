module.exports = (sequelize, type) => {
    var Profile =  sequelize.define('Article', {
        url: {
            type: type.STRING,
            primaryKey: true,
            allowNull: false
        },
        title: type.STRING,
        readTime: type.INTEGER,
        img: type.STRING,
    });
    
    Profile.prototype.getArticleInfo = function(){
        return {
            url: this.url,
            title: this.title,
            readTime: this.readTime,
            img: this.img
         }
    }
    return Profile;
}