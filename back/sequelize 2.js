const Sequelize = require('sequelize')
const UserModel = require('./models/Users')
const ProfileModel = require('./models/Profiles')
const ArticleModel = require('./models/Articles')
const AnalyticsModel = require('./models/Analytics')
const UserArticleModel = require('./models/UserArticles')
const TrendingModel = require('./models/Trending')
const FollowerModel = require('./models/Follower')
const FolderModel = require('./models/Folders')
const SavedArticleModel = require('./models/SavedArticles')
const ConvoModel = require('./models/Convo')
const Convo_memberModel = require('./models/Convo_members')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const sequelize = new Sequelize('test_server1', process.env.RDS_USER, process.env.RDS_PASSWORD, {
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
const Analytics = AnalyticsModel(sequelize, Sequelize)
const Profiles = ProfileModel(sequelize, Sequelize)
const Articles = ArticleModel(sequelize, Sequelize)
const UserArticles = UserArticleModel(sequelize, Sequelize);
const Trending = TrendingModel(sequelize, Sequelize);
const Followers = FollowerModel(sequelize, Sequelize);
const Folders = FolderModel(sequelize, Sequelize);
const SavedArticles = SavedArticleModel(sequelize, Sequelize);
const Convos = ConvoModel(sequelize, Sequelize);
const Convo_member = Convo_memberModel(sequelize, Sequelize);

sequelize.sync()
  .then(() => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://go-off.co/:8000/api/users/current', true); //finds the current user
    console.log("8000: ", xhr.status)
    xhr.open("GET", 'http://go-off.co/:4050/api/users/current', true); //finds the current user
    console.log("4050: ", xhr.status)
    xhr.open("GET", 'http://go-off.co/:3000/api/users/current', true); //finds the current user
    console.log("3000: ", xhr.status)
    xhr.open("GET", 'http://go-off.co/:8080/api/users/current', true); //finds the current user
    console.log("8080: ", xhr.status)
    console.log(`Database & tables created!`)
  })

module.exports = {
  Users, sequelize
}