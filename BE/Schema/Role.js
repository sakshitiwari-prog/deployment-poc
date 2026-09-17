const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
});

// unique per organization, not globally
RoleSchema.index({ organization: 1, name: 1 }, { unique: true });

const Role = mongoose.model("Role", RoleSchema);
module.exports = { Role };