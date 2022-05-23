'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Leave.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Leave.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "id User can't be empty" },
        notNull: { msg: "id User can't be empty" }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Type can't be empty" },
        notNull: { msg: "Type can't be empty" }
      }
    },
    dayType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Day Type can't be empty" },
        notNull: { msg: "Day Type can't be empty" }
      }
    },
    dateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Date From can't be empty" },
        notNull: { msg: "Date From can't be empty" }
      }
    },
    dateTo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Date To can't be empty" },
        notNull: { msg: "Date To can't be empty" }
      }
    },
    totalDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Total Days can't be empty" },
        notNull: { msg: "Total Days can't be empty" }
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Reason can't be empty" },
        notNull: { msg: "Reason can't be empty" }
      }
    },
    status: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Status can't be empty" },
        notNull: { msg: "Status can't be empty" }
      }
    },
    approvedBy: {
      type:  DataTypes.STRING,
    }
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.dateFrom = new Date(instance.dateFrom),
        instance.dateTo = new Date (instance.dateTo)
      },
    },
    sequelize,
    modelName: 'Leave',
  });
  return Leave;
};