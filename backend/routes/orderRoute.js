import express from "express";
import { placeOrder, listOrders, listUserOrders, updateOrderStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.get("/user", authMiddleware, listUserOrders);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.patch("/status", adminAuth, updateOrderStatus);

export default orderRouter;