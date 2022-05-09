const { User } = require("../models")
const { comparePassword } = require("../helpers/bcrypt") 
const { signToken } = require("../helpers/jwt")

class Controller {
    static async createUser (req, res, next) {
        try {
            const { fullName, email, password, position, employeeCode, reportingManager, level} = req.body
            const create = await User.create({
                fullName, email, password, position, employeeCode, reportingManager, level
            })

            const response = {
                fullName : create.fullName,
                email: create.email,
                level: create.level
            }

            res.status(201).json(response)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Controller