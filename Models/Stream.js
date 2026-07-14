const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Stream = sequelize.define('Stream', {
    id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  sub_admin_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  } 
 }, {
  tableName: 'streams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
module.exports = Stream;
