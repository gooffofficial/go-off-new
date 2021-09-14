const Folders = require("./Folders");

module.exports = (sequelize, type) => {
    var SavedArticle =  sequelize.define('SavedArticle', {
        FolderId: { //unique folder id it is attached to
            type: type.INTEGER,
            //allowNull: false,
        },
        article: {
            type: type.STRING,
            allowNull: false
        },
        userId: {
            type: type.INTEGER,
            allowNull: false
        }        
    });
    
    SavedArticle.prototype.getFolderInfo = function(){
        return {
            FolderId: this.FolderId,
            article: this.article,
            userId: this.userId,
         }
    }
    return SavedArticle;
}