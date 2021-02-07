module.exports = (sequelize, type) => {
    var Follower =  sequelize.define('Convo', {
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
            defaultValue: 0
        }
    })
    return Follower;
}