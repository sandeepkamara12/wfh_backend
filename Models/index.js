const sequelize = require('./db');
const User = require('./User');
const Classroom = require('./Classroom');

module.exports = {
  sequelize,
  User,
  Classroom,
};