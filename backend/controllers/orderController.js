import orderModel from "../models/orderModel.js";
import userModel from "../models/useModel.js";
import productModel from "../models/productModel.js";

// Placing user order from frontend
const placeOrder = async (req, res) => {
    try {
        const { items, address, paymentMethod = "cod" } = req.body;
        if (!Array.isArray(items) || items.length === 0 || !address || !["cod", "stripe", "razorpay"].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Order items and delivery address are required" });
        }

        const productIds = [...new Set(items.map((item) => item._id || item.productId))];
        if (productIds.some((productId) => typeof productId !== "string" || productId.length === 0)) {
            return res.status(400).json({ success: false, message: "One or more order items are missing a product" });
        }
        const products = await productModel.find({ _id: { $in: productIds } }).lean();
        const productMap = new Map(products.map((product) => [product._id, product]));
        const orderItems = [];

        for (const item of items) {
            const product = productMap.get(item._id || item.productId);
            const quantity = Number(item.quantity);
            if (!product || !Number.isInteger(quantity) || quantity < 1 || !Array.isArray(product.sizes) || !product.sizes.includes(item.size)) {
                return res.status(400).json({ success: false, message: `Invalid order item for product ${item.productId || item._id}` });
            }
            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                size: item.size,
                quantity
            });
        }

        const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const amount = subtotal + 10;
        const newOrder = new orderModel({
            userId: req.userId,
            items: orderItems,
            amount,
            address,
            payment: paymentMethod !== "cod",
            paymentMethod,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to place order" });
    }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load admin orders" });
    }
};

const listUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load orders" });
    }
};

const updateOrderStatus = async (req, res) => {
    const allowedStatuses = ["Order Placed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    try {
        const order = await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { status: req.body.status },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to update order" });
    }
};

export { placeOrder, listOrders, listUserOrders, updateOrderStatus };