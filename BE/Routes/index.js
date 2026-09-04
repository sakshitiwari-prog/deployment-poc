const express = require("express");
const router = express.Router();
const OrderRoutes = require("./order");
const ProductRoutes = require("./product");
const UserRoutes = require("./onboarding");
const ConvoRoutes = require("./convo");

const StudentRoutes = require("./student");
router.use("/orders", OrderRoutes);
router.use("/products", ProductRoutes);
router.use("/users", UserRoutes);
router.use("/convo", ConvoRoutes);
router.use("/api", StudentRoutes);

module.exports = router;
