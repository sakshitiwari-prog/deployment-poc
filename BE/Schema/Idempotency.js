const mongoose = require("mongoose");

const idempotency = new mongoose.Schema(
  {
    response: {
      type: mongoose.Schema.Types.Mixed,
    },

    statusCode: {
      type: Number,
    },

    // Optional but useful
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    key: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);
const IdempotencyRegister = mongoose.model("IdempotencyRegister", idempotency);
module.exports = { IdempotencyRegister };
