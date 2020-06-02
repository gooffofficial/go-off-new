const Sequelize = require('sequelize')
const UserModel = require('./models/Users')

const sequelize = new Sequelize('test_server1', 'admin', 'INSERT AWS RDB PASSWORD', {
  port: 3306,
  host: 'INSERT AWS RDB ADDRESS',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Users = UserModel(sequelize, Sequelize)

sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Users,
}