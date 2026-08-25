const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  content: String,
  role: String,
});
const Message = mongoose.model("Message", messageSchema);
module.exports = { Message };
