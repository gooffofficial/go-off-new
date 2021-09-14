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
            type: type.STRING,
            allowNull: false
        },
        host: {
            type: type.INTEGER,
            allowNull: false
        },
        roomId: {
            type: type.STRING,
            allowNull: false
        }, 
        title: {
            type: type.STRING, 
            allowNull: false
        },
        tz: {
            type: type.INTEGER,
            allowNull: false
        },
        description: {
            type: type.STRING, 
            allowNull: true
        }
    })

    Convo.prototype.getConvoInfo = function() {
        return {
            id: this.id,
            article: this.article,
            time: this.time,
            host: this.host,
            roomId: this.roomId,
            title: this.title,
            description: this.description
        }
    }
    return Convo;
}