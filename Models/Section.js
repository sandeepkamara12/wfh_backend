const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Section = sequelize.define('Section', {
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
  stream: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  } 
 }, {
  tableName: 'sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
module.exports = Section;
