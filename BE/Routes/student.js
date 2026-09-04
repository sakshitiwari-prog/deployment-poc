const express = require("express");
const { Authenticate, Authorize } = require("../Middleware/authenticate");
const {
  getSchoolList,
  addSchoolList,
  userInfo,
  Login,
  register,
  getRolesList,
  getPermissionList,
  addRolePermissionList,
  addPermissionList,
  addRolesList,
} = require("../Controller/school");
const router = express.Router();

router.get("/schools", getSchoolList);
router.get("/user-info", Authenticate, Authorize("users:read"), userInfo);
router.post("/schools", addSchoolList);
router.get("/roles", getRolesList);
router.post("/roles", addRolesList);
router.get("/permission", getPermissionList);
router.post("/permission", addPermissionList);

router.post("/role-permission", addRolePermissionList);
router.post("/onBoard", register);
router.post("/login", Login);

module.exports = router;
