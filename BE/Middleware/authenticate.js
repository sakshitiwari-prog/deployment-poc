const jwt = require("jsonwebtoken");

const { RolePermissionSchema } = require("../Schema/Role_Permission");
function Authenticate(req, res, next) {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      return res.status(401).json({
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
      console.log('====================================');
      console.log(req.user,'req.user');
      console.log('====================================');
     const roleInfo = await RolePermissionSchema
  .findOne({
    role: req.user.role,
    organization: req.user.schoolId,       // scope to the token's tenant
  })
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
