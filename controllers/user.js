const { User, Leave } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {
  static async createUser(req, res, next) {
    try {
      const {
        fullName,
        email,
        password,
        position,
        employeeCode,
        reportingManager,
        aditionalManager,
        leaveAvailable,
        level,
      } = req.body;

      const create = await User.create({
        fullName,
        email,
        password,
        position,
        employeeCode,
        reportingManager,
        aditionalManager,
        leaveAvailable,
        level,
      });

      const response = {
        fullName: create.fullName,
        email: create.email,
        level: create.level,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
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

      if (!foundUser) throw { name: "InvalidInput" };
      if (!comparePassword(password, foundUser.password))
        throw { name: "InvalidInput" };

      const payload = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
        level: foundUser.level,
      };

      const token = signToken(payload);

      res.status(200).json({ access_token: token, level: foundUser.level });
    } catch (error) {
      next(error);
    }
  }

  static async updateLeave(req, res, next) {
    try {
      const { leaveAvailable } = req.body;
      const { id } = req.params;

      const foundUser = await User.findByPk(id);

      if (!foundUser) throw { name: "UserNotFound" };

      await User.update({ leaveAvailable }, { where: { id } });

      res.status(200).json({ message: `Success edit leave available` });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const foundUser = await User.findByPk(id);

      if (!foundUser) throw { name: "UserNotFound" };

      await User.destroy({ where: { id } });

      res.status(200).json({ message: `Success delete user` });
    } catch (error) {
      next(error);
    }
  }

  static async initialUser(req, res, next) {
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
      next(error);
    }
  }

  static async listUser(req, res, next) {
    try {
      const data_user = await User.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
      res.status(200).json(data_user);
    } catch (error) {
      next(error);
    }
  }

  static async detailUser(req, res, next) {
    try {
      const { id } = req.params;
      const data_user = await User.findByPk(id, {
        include: [
          {
            model: Leave,
          },
        ],
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      if (!data_user) throw { name: "UserNotFound" };

      res.status(200).json(data_user);
    } catch (error) {
      next(error);
    }
  }

  static async userLogin(req, res, next) {
    try {
      const { id } = req.user;
      const data_user = await User.findByPk(id, {
        include: [
          {
            model: Leave,
          },
        ],
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      if (!data_user) throw { name: "UserNotFound" };

      res.status(200).json(data_user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
