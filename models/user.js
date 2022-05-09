'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Full Name can't be empty" },
        notNull: { msg: "Full Name can't be empty" }
      }
    },
    email: {
      unique: { msg: "Email must be unique" },
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Email can't be empty" },
        notNull: { msg: "Email can't be empty" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: `Password can't be empty` },
        notEmpty: { msg: `Password can't be empty` },
        len: {
          args: [8, undefined],
          msg: "The password must contain minimal 8 characters.",
        },
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Position can't be empty" },
        notNull: { msg: "Position can't be empty" }
      }
    },
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Employee Code can't be empty" },
        notNull: { msg: "Employee Code can't be empty" }
      }
    },
    reportingManager: {
      type: DataTypes.STRING.DataTypes,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Reporting Manager can't be empty" },
        notNull: { msg: "Reporting Manager can't be empty" }
      }
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Level can't be empty" },
        notNull: { msg: "Level can't be empty" }
      }
    }
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.password = hashPassword(instance.password);
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};