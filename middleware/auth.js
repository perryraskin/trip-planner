const jwt = require("jsonwebtoken")

export default function auth(req, res, next) {
  const token = req.headers["x-auth-token"]
  //console.log(req.headers["x-auth-token"])
  try {
    // Decode token
    const decoded = jwt.decode(token)

    return decoded
    //TODO: verify token from Feather's secret key
    //jwt.verify(token)

    //next()
  } catch (e) {
    // Check for token
    if (!token)
      res.status(401).json({ message: "No token, authorization denied" })
    else res.status(400).json({ message: "Token is not valid" })
  }
}
