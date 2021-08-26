const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')


exports.createToken = function ({ payload }) {
  return jwt.sign(payload, process.env.KEY_TOKEN)
}

exports.checkToken = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.KEY_TOKEN);
    req.userData = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Auth Failed' })
  }
}

exports.getID = function getId({ req }) {
  return jwt_decode(req.headers.authorization.split(" ")[1]).data._id
}