const mongoose = require("mongoose");

const RolePermission = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  permission: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permission",
    required: true,
  }],
});

RolePermission.index({ organization: 1, role: 1 }, { unique: true });

const RolePermissionSchema = mongoose.model("RolePermission", RolePermission);
module.exports = { RolePermissionSchema };