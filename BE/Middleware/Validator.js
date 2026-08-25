// normal middleware

const jwt = require("jsonwebtoken");

const requestCheckMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      next(error);
      return;
    }
    req.body = value;
    next();
  };
};
async function authMiddleware(req, res, next) {
  try {
    // Read token from cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Access token missing",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user data for next middleware/controller
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = { requestCheckMiddleware, authMiddleware };
