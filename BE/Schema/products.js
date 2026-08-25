const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
});
const Product = mongoose.model("Product", productSchema);
module.exports = { Product };
