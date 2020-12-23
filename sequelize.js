const Sequelize = require('sequelize')
const UserModel = require('./models/Users')
const ProfileModel = require('./models/Profiles')
const ArticleModel = require('./models/Articles')
const AnalyticsModel = require('./models/Analytics')
const UserArticleModel = require('./models/UserArticles')
const FollowerModel = require('./models/Follower')

const sequelize = new Sequelize('test_server1', 'admin' , 'password1', {
  port: '3306',
  host: 'new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Users = UserModel(sequelize, Sequelize)
const Analytics = AnalyticsModel(sequelize, Sequelize)
const Profiles = ProfileModel(sequelize, Sequelize)
const Articles = ArticleModel(sequelize, Sequelize)
const UserArticles = UserArticleModel(sequelize, Sequelize);
const Followers = FollowerModel(sequelize, Sequelize);


sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Users, sequelize
}