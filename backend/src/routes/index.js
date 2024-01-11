import { Router } from "express";

import userRoutes from "../routes/user.route.js";
import categoryRoutes from "../routes/category.route.js"
import productRoutes from "../routes/product.route.js";
import orderRoutes from '../routes/order.route.js';
import reviewRoutes from '../routes/review.route.js';
import uploadRoutes from '../routes/upload.route.js';

const router = Router();

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/review", reviewRoutes);
router.use("/upload", uploadRoutes);

export default router;