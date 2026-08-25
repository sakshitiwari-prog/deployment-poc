const exporess = require("express");
const router = exporess.Router();
const { userSchema } = require("../Schema/onboarding");
const {
  signUpHandler,
  testHandler,
  signInHandler,
  refreshHandler,
  googleLogin,
  redirectLogin,
} = require("../Controller/controller");
const {
  requestCheckMiddleware,
  authMiddleware,
} = require("../Middleware/Validator");

// authentication handler
router.post("/sign-up", signUpHandler);

router.post("/refresh", refreshHandler);

router.get("/redirect", redirectLogin);
router.get("/login-with-google", googleLogin);
router.post("/sign-in", signInHandler);

module.exports = router;
