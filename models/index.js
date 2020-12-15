'use strict';

const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize('test_server1', 'admin', 'password1', {
  host: 'new-db.cga2dg8jzozg.us-west-1.rds.amazonaws.com',
  port: '3306',
  dialect: 'mysql'
});

fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
  const model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;