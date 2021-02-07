module.exports = (sequelize, type) => {
    var Convo =  sequelize.define('Convo', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
        article: {
            type: type.STRING,
            allowNull: false
        },  
        time : {
            type: type.DATE,
            allowNull: false
        },
        host: {
            type: type.INTEGER,
            allowNull: false
        }
    })
    return Convo;
}