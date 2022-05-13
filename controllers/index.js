const { User, Leave } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { Op } = require("sequelize");

class Controller {
  static async createUser(req, res, next) {
    try {
      const {
        fullName,
        email,
        password,
        position,
        employeeCode,
        reportingManager,
        level,
      } = req.body;
      const create = await User.create({
        fullName,
        email,
        password,
        position,
        employeeCode,
        reportingManager,
        level,
      });

      const response = {
        fullName: create.fullName,
        email: create.email,
        level: create.level,
      };

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const foundUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!foundUser) {
        throw { name: "InvalidInput" };
      }

      if (!comparePassword(password, foundUser.password)) {
        throw { name: "InvalidInput" };
      }

      const payload = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        level: foundUser.level,
      };

      const token = signToken(payload);

      res.status(200).json({ access_token: token, level: foundUser.level });
    } catch (err) {
      console.log(err);
    }
  }

  static async reqLeave(req, res, next) {
    try {
      const { id } = req.user;
      const { type, dayType, dateFrom, dateTo, reason } = req.body;

      const data_user = User.findByPk(id);

      const from = new Date(dateFrom);
      const to = new Date(dateTo);

      const date1 = from.getDate();
      const date2 = to.getDate();

      const count = date2 - date1;

      if (type === "Leave" && data_user.leaveAvailable < count) {
        throw { name: "Exceeding the leave" };
      }

      const create = await Leave.create({
        UserId: req.user.id,
        type,
        dayType,
        dateFrom,
        dateTo,
        reason,
        status: "Process",
      });

      const response = {
        UserId: create.UserId,
        type: create.type,
        status: create.status,
      };

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
    }
  }

  static async appLeave(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const data = await Leave.findByPk(id);

      const from = new Date(data.dateFrom);
      const to = new Date(data.dateTo);

      const date1 = from.getDate();
      const date2 = to.getDate();

      const count = date2 - date1;

      if (data) {
        const status = await Leave.update({ status }, { where: { id } });

        if (data.type === "Optional") {
          await User.update(
            { leaveAvailable: data.leaveAvailable + count },
            { where: { id } }
          );
        } else {
          await User.update(
            { leaveAvailable: data.leaveAvailable - count },
            { where: { id } }
          );
        }

        res.status(200).json({ message: `Success edit status` });
      } else {
        console.log("Data Not Found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { id, status, type } = req.query;

      let condition = {
        include: [
          {
            model: User,
          },
        ],
        order: [["updatedAt", "DESC"]],
        where: {},
      };

      if (id) condition.where.id = id;
      if (status) condition.where.status = status;
      if (type) condition.where.type = type;

      const data = await Leave.findAll(condition);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async listUser(req, res, next) {
    try {
      const { name, manager } = req.query;

      let condition = {
        include: [
          {
            model: Leave,
          },
        ],
        order: [["id", "ASC"]],
        where: {},
      };

      if (name) condition.where.fullName = { [Op.iLike]: `%${name}%` };
      if (manager)
        condition.where.reportingManager = { [Op.iLike]: `%${manager}%` };

      const data = await User.findAll(condition);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async listById(req, res, next) {
    try {
      const { id } = req.user;

      let condition = {
        include: [
          {
            model: Leave,
          },
        ],
        order: [["id", "ASC"]],
        where: { id },
      };

      const data = await User.findAll(condition);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async getInitial(req, res, next) {
    try {
      const { fullName } = req.user;
      const arrName = fullName.split(" ");
      let initial = "";
      if (arrName.length > 1) {
        initial = arrName[0][0] + arrName[1][0];
      } else {
        initial = arrName[0][0];
      }
      initial = initial.toUpperCase();
      res.status(200).json(initial);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Controller;
