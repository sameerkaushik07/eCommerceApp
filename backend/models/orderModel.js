import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Placed" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ["cod", "stripe", "razorpay"], default: "cod" }
});

// If the model already exists, use it, otherwise create a new one.
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;