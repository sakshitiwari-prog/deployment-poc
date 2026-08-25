const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: String,

  lastInteractionId: {
    type: String,
    default: null,
  },
});
const Conversation = mongoose.model("Conversation", messageSchema);
module.exports = { Conversation };
