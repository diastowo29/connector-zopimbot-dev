module.exports = (sequelize, type) => {
    return sequelize.define('chat-logs', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid: type.STRING(50),
        content: type.TEXT,
        channel_id: type.STRING(510)
    })
}