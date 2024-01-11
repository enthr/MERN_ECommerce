import { Router } from "express";

import { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById, searchProducts, getTopProducts } from "../controllers/product.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import authRoles from "../utils/authRoles.js";

const router = Router();

router.post("/create", isLoggedIn, authorize(authRoles.ADMIN), createProduct);
router.put("/update/:productId", isLoggedIn, authorize(authRoles.ADMIN), updateProductById);

router.get("/all", getAllProducts);
router.get("/top", getTopProducts);
router.get("/search", searchProducts);
router.get("/:productId", getProductById);

router.delete("/delete/:productId", isLoggedIn, authorize(authRoles.ADMIN), deleteProductById);

export default router;