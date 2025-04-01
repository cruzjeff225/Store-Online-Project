import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    products: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ]
});

export default mongoose.model("Cart", CartSchema);
