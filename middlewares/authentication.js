const { User } = require(`../models`);
const { verifyToken } = require(`../helpers/jwt`);

const authentication = async (req, res, next) => {
  try {
    const { access_token: token } = req.headers;

    if (!token) throw { name: `InvalidInput` };

    const user = verifyToken(token);

    const userLogin = await User.findOne({
      where: {
        id: user.id,
        email: user.email,
      },
    });

    if (!token) throw { name: `InvalidInput` };

    req.user = {
      id: userLogin.id,
      fullName: userLogin.fullName,
      email: userLogin.email,
      level: userLogin.level,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
