const jwt = require("jsonwebtoken");

const secretJwt = process.env.JWT_SECRET;

const signToken = (payload) => {
	return jwt.sign(payload, secretJwt);
};

const verifyToken = (token) => {
	return jwt.verify(token, secretJwt);
};

module.exports = {
	signToken,
	verifyToken,
};