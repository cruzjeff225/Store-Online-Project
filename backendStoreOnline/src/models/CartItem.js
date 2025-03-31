const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
});

module.exports = mongoose.model("CartItem", CartItemSchema);
