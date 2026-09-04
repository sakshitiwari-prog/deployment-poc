const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  ],
});
const roleSchema = mongoose.model("RoleSchema", RoleSchema);
module.exports = { roleSchema };
