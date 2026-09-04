const jwt = require("jsonwebtoken");

const { roleSchema } = require("../Schema/Role_Permission");
function Authenticate(req, res, next) {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      res.status(401).json({
        msg: "token missing",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode, "decode");

    req.user = decode;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
function Authorize(...roles) {
  return async (req, res, next) => {
    try {
      const roleInfo = await roleSchema
        .findOne({ role: req.user?.role })
        .populate("permission");
      if (!roleInfo) {
        return res.status(403).json({
          msg: "Specific role not found",
        });
      }
      const userPermission = roleInfo.permission.map(
        (permission) => permission?.name,
      );
      const hasPermission = roles.every((role) =>
        userPermission.includes(role),
      );
      console.log(roles, userPermission, roleInfo, "userPermission");
      if (!hasPermission) {
        return res.status(403).json({
          msg: "You don't have permission",
        });
      }
      next();
    } catch {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
}
module.exports = {
  Authenticate,
  Authorize,
};
