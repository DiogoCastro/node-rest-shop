const expressJwt = require("express-jwt")
const { secret } = require("../config.json")

const authorize = role => {
	return [
		expressJwt({ secret }),

		(req, res, next) => {
			if (role === "admin" && !req.user.isAdmin) {
				return res.status(401).json({ message: "Unauthorized" })
			}
			next()
		}
	]
}

module.exports = authorize