module.exports = (sequelize, type) => {
    var Analytics = sequelize.define('Analytics', {
        id: {
            type: type.STRING,
            primaryKey: true,
            allowNull: false
        },
        totalMessages: type.INTEGER,
        totalWords: type.INTEGER,
        totalLetters: type.INTEGER,
        averageWordsMessage: type.FLOAT,
        averageLettersMessage: type.FLOAT,
        topWord1: type.STRING,
        topWord2: type.STRING,
        topWord3: type.STRING,
        topWord4: type.STRING,
        topWord5: type.STRING,
        numUsers: type.INTEGER,
        convoLength: type.FLOAT,
        convoTime: type.STRING,
        convoDate: type.STRING,
        duration: type.FLOAT,
        locations: type.JSON
    })
    Analytics.prototype.getData = function(){
        return{
            id: this.id,
            totalMessages: this.totalMessages,
            totalLetters: this.totalLetters,
            totalWords: this.totalWords,
            topWord1: this.topWord1,
            topWord2: this.topWord2,
            topWord3: this.topWord3,
            topWord4: this.topWord4,
            topWord5: this.topWord5,
            numUsers: this.numUsers,
            duration: this.duration,
            averageLettersMessage: this.averageLettersMessage,
            averageWordsMessage: this.averageWordsMessage,
            convoLength: this.convoLength,
            convoTime: this.convoTime,
            convoDate: this.convoDate,
            locations: this.locations
        }
    }
    return Analytics;
}