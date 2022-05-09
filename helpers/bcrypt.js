const bcryptjs = require("bcryptjs");

const hashPassword = (password) => {
	return bcryptjs.hashSync(password, 10);
};

const comparePassword = (password, hash) => {
	return bcryptjs.compareSync(password, hash);
};

module.exports = {
	hashPassword,
	comparePassword,
};