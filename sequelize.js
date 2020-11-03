const Sequelize = require('sequelize')
const UserModel = require('./models/Users')
const ProfileModel = require('./models/Profiles')
const ArticleModel = require('./models/Articles')
const UserArticleModel = require('./models/UserArticles')

const sequelize = new Sequelize('test_server1', process.env.RDS_USER , process.env.RDS_PASSWORD, {
  port: process.env.RDS_PORT,
  host: process.env.RDS_HOSTNAME,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Users = UserModel(sequelize, Sequelize)
const Profiles = ProfileModel(sequelize, Sequelize)
const Articles = ArticleModel(sequelize, Sequelize)
const UserArticles = UserArticleModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Users, sequelize
}