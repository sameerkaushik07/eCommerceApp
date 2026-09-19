import orderModel from "../models/orderModel.js";
import userModel from "../models/useModel.js";

// Placing user order from frontend
const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        if (!Array.isArray(items) || items.length === 0 || !address || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
            return res.status(400).json({ success: false, message: "Order items and delivery address are required" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items,
            amount: Number(amount),
            address,
            payment: true,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, listOrders };