const { User, Leave } = require("../models");
class LeaveController {
  static async create(req, res, next) {
    try {
      const { id } = req.user;
      const { type, dayType, dateFrom, dateTo, reason } = req.body;

      const data_user = await User.findByPk(id);

      const from = new Date(dateFrom);
      const to = new Date(dateTo);

      const month1 = from.getMonth() + 1;
      const month2 = to.getMonth() + 1;

      const date1 = from.getDate();
      const date2 = to.getDate();

      let count = date2 - date1;

      if (month2 > month1) {
        let date_month = (month2 - month1) * 30;
        count = count + date_month;
      }

      if (type === "Leave" && data_user.leaveAvailable < count) {
        throw { name: "Exceeding" };
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
      next(error);
    }
  }

  static async appLeave(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const data_leave = await Leave.findByPk(id);
      const data_user = await User.findByPk(data_leave.UserId);

      const from = new Date(data_leave.dateFrom);
      const to = new Date(data_leave.dateTo);

      const date1 = from.getDate();
      const date2 = to.getDate();

      const count = date2 - date1;

      if (!data_leave) throw { name: "LeaveNotFound" };

      await Leave.update({ status }, { where: { id } });

      if (data_leave.type === "Optional") {
        const available = data_user.leaveAvailable + count;
        await User.update(
          { leaveAvailable: available },
          { where: { id: data_leave.UserId } }
        );
      } else if (data_leave.type === "Leave") {
        const available = data_user.leaveAvailable - count;
        await User.update(
          { leaveAvailable: available },
          { where: { id: data_leave.UserId } }
        );
      }

      res.status(200).json({ message: `Success edit status` });
    } catch (error) {
      next(error);
    }
  }

  static async list(req, res, next) {
    try {
      const { status, type } = req.query;

      let condition = {
        include: [
          {
            model: User,
          },
        ],
        order: [["updatedAt", "DESC"]],
        where: {},
      };

      if (status) condition.where.status = status;
      if (type) condition.where.type = type;

      const data = await Leave.findAll(condition);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async listById(req, res, next) {
    try {
      const { id } = req.params;

      const data = await Leave.findByPk(id, {
        include: [
          {
            model: User,
          },
        ],
        order: [["updatedAt", "DESC"]],
      });

      if (!data) throw { name: "LeaveNotFound" };

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LeaveController;
