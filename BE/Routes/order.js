const express = require("express");
const { orderPlaceHandler, getOrderList } = require("../Controller/controller");
const router = express.Router();
router.post("/place-order", orderPlaceHandler);
// router.get("/:id", getOrderStatus);
router.get("/", getOrderList);
module.exports = router;
