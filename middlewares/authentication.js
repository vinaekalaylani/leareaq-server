const { User } = require(`../models`)
const { verifyToken } = require(`../helpers/jwt`)

const authentication = async (req, res, next) => {
    try {
        const { access_token: token } = req.headers

        if (!token) {
            throw { name : `Unauthenticated`}
        }
        
        const user = verifyToken(token)
        
        const userLogin = await User.findOne({
            where: { 
                id: user.id,
                email: user.email
            }
        })

        if (!userLogin) {
            throw { name: `AuthenticationError`}
        }

        req.user = {
            id: userLogin.id,
            fullName: userLogin.fullName,
            email: userLogin.email
        }

        next()

    } catch (error) {
        console.log(error);
    }
} 

module.exports = authentication