const mongoose = require("mongoose");

const documentChunkSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    page: {
      type: Number,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema);

module.exports = {
  DocumentChunk,
};
