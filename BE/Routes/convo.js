const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createConversationList,
  getConversationList,
  getConversationItemList,
  uploadDoc,
  similaritySearch,
  addChatInConversation,
} = require("../Controller/conversation");
const upload = multer({
  dest: "uploads/",
});
router.post("/documents/upload", upload.single("file"), uploadDoc);
router.post("/add", createConversationList);
router.get("/", getConversationList);
router.get("/:id", getConversationItemList);
router.post("/add/msg", addChatInConversation);
router.post("/search", similaritySearch);
module.exports = router;
