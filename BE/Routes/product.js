const express = require("express");
const { getProductList, addProduct } = require("../Controller/controller");
const { authMiddleware } = require("../Middleware/Validator");
const router = express.Router();

router.post("/", authMiddleware, addProduct);
router.get("/", authMiddleware, getProductList);
module.exports = router;
