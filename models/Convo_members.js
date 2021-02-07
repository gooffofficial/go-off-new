module.exports = (sequelize, type) => {
    var Convo_member =  sequelize.define('Convo_members', {
        UserId: {
            type: type.INTEGER,
            allowNull: false,
          },
        ConvoId: {
            type: type.INTEGER,
            allowNull: false
        }
    })
    return Convo_member;
}