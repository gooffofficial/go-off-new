const Users = require("./Users");

module.exports = (sequelize, type) => {
    var Folder =  sequelize.define('Folder', {
        id: {
            type: type.INTEGER,
            primaryKey: true, //unique identifier for user
            autoIncrement: true,
            allowNull: false,
        },
        UserId: {
            type: type.INTEGER,
            allowNull: false
        },
        foldername: type.STRING
        
    });
    
    Folder.prototype.getFolderInfo = function(){
        return {
            id: this.id,
            UserId: this.UserId,
            foldername: this.foldername,
         }
    }
    return Folder;
}