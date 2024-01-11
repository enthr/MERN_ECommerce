import { Router } from "express";

import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderToDeliveredById, updateOrderToPaidById } from "../controllers/order.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import authRoles from "../utils/authRoles.js";

const router = Router();

router.post("/create", isLoggedIn, createOrder);
router.put("/delivered/:orderId", isLoggedIn, authorize(authRoles.ADMIN), updateOrderToDeliveredById);
router.put("/paid/:orderId", isLoggedIn, updateOrderToPaidById);

router.get("/all", isLoggedIn, authorize(authRoles.ADMIN), getAllOrders);
router.get("/user", isLoggedIn, getUserOrders);
router.get("/:orderId", isLoggedIn, getOrderById);

export default router;