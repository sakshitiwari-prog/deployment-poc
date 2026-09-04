const mongoose = require("mongoose");

const schoolUserSchema = new mongoose.Schema({
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schoolUser",
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});
schoolUserSchema.index(
  {
    userId: 1,
    schoolId: 1,
  },
  {
    unique: true,
  },
);
const schoolUserPair = mongoose.model("schoolUserPair", schoolUserSchema);
module.exports = { schoolUserPair };
