const authorization = async (req, res, next) => {
  try {
    const { level } = req.user;

    if (level == 1) next();
    else throw { name: "Forbidden" };
    
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
