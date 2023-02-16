const { DataTypes } = require("sequelize")

module.exports = (sequelize, type) => {
    return sequelize.define('chat-logs', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uuid: type.STRING(50),
        content: type.TEXT,
        channel_id: type.STRING(200),
        retry: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        }
    },{
      initialAutoIncrement: 1000,
    })
}