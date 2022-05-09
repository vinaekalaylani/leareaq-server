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

    static async login(req, res, next) {
		try {
			const { email, password } = req.body;

			const foundUser = await User.findOne({
				where: {
					email,
				},
			});

			if (!foundUser) {
				// throw { name: "InvalidInput" };
                console.log("user not found")
			}

			if (!comparePassword(password, foundUser.password)) {
				// throw { name: "InvalidInput" };
                console.log("Invalid Input");
			}

			const payload = {
				fullName: foundUser.fullName,
				email: foundUser.email,
                level: foundUser.level
			};

			const token = signToken(payload);

			res.status(200).json({ access_token: token, level: foundUser.level });
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = Controller