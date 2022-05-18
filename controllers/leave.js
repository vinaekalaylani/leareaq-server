const { User, Leave } = require("../models");
const { Op } = require("sequelize");

class LeaveController {
  static async create(req, res, next) {
    try {
      const { id } = req.user;
      const { type, dayType, dateFrom, dateTo, totalDays, reason } = req.body;

      const data_user = await User.findByPk(id);

      if (data_user.leaveAvailable < totalDays) {
        throw { name: "Exceeding" }
      }

      const create = await Leave.create({
        UserId: req.user.id,
        type,
        dayType,
        dateFrom,
        dateTo,
        totalDays,
        reason,
        status: 0,
      });

      const response = {
        UserId: create.UserId,
        type: create.type,
        status: create.status,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async appLeave(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const data_leave = await Leave.findByPk(id);
      const data_user = await User.findByPk(data_leave.UserId);

      if (!data_leave) throw { name: "LeaveNotFound" };

      await Leave.update({ status }, { where: { id } });

      const available = 0
      if (data_leave.type === "Optional") {
        available = data_user.leaveAvailable + data_user.totalDays;
      } else if (data_leave.type === "Unpaid") {
        available = data_user.leaveAvailable
      } else {
        available = data_user.leaveAvailable - data_user.totalDays;
      }

      await User.update(
        { leaveAvailable: available },
        { where: { id: data_leave.UserId } }
      );

      res.status(200).json({ message: `Success edit status` });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { level, fullName } = req.user
      const leaves = await Leave.findAll({
        include: [
          {
            model: User,
          },
        ],
        order: [["createdAt", "DESC"], ["status", "ASC"]],
      });

      let data
      if (level == 0) {
        data = leaves.filter(el => el.User.fullName === fullName);
      } else if (level == 1) {
        data = leaves.filter(el => el.User.reportingManager === fullName || el.User.aditionalManager === fullName);
      } else {
        data = leaves
      }

      res.status(200).json(data);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  static async history(req, res, next) {
    try {
      const { status, type, year, isDeleted } = req.query;

      let condition = {
        include: [
          {
            model: User,
          },
        ],
        order: [["createdAt", "DESC"]],
        where: {},
      };

      if (status) condition.where.status = status;
      if (type) condition.where.type = type;
      if (isDeleted) condition.where.isDeleted = isDeleted;
      if (year) {
        condition.where.dateFrom = { [Op.iLike]: `%${year}%` };
        condition.where.dateTo = { [Op.iLike]: `%${year}%` };
      }

      const data = await Leave.findAll(condition);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Leave.findByPk(id, {
        include: [
          {
            model: User,
          },
        ],
      });

      if (!data) throw { name: "LeaveNotFound" };
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LeaveController;
