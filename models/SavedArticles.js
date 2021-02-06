const Folders = require("./Folders");

module.exports = (sequelize, type) => {
    var SavedArticle =  sequelize.define('SavedArticle', {
        FolderId: { //unique folder id it is attached to
            type: type.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        article: type.STRING        
    });
    
    SavedArticle.prototype.getFolderInfo = function(){
        return {
            FolderId: this.FolderId,
            article: this.article,
         }
    }
    return SavedArticle;
}