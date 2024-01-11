import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    updateCategory,
    getAllCategories,
    getCategoryById
} from "../controllers/category.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import authRoles from "../utils/authRoles.js";

const router = Router();

// Create Category
router.post("/create", isLoggedIn, authorize(authRoles.ADMIN), createCategory);

// Update Category
router.put("/update/:categoryId", isLoggedIn, authorize(authRoles.ADMIN), updateCategory);

// Delete Category
router.delete("/delete/:categoryId", isLoggedIn, authorize(authRoles.ADMIN), deleteCategory);

// Get all Categories
router.get("/all", getAllCategories);

// Get Category By Id
router.get("/:categoryId", getCategoryById);

export default router;