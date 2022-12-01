const jwt = require('jsonwebtoken');
const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { firstName, userId } = decoded;
    req.firstName = firstName;
    req.userId = userId;
    console.log(userId);
    next();
  } catch {
    next('Authentication  failure');
  }
};
module.exports = checkLogin;
