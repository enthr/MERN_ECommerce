import { Router } from "express";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import authRoles from "../utils/authRoles.js";
import { createReview, updateReviewById, deleteReviewById, getReviewById, getAllProductReviews, getAllReviews } from "../controllers/review.controller.js";

const router = Router();

router.post("/create", isLoggedIn, createReview);
router.put("/update/:reviewId", isLoggedIn, authorize(authRoles.ADMIN, authRoles.USER), updateReviewById);

router.get("/all/:productId", getAllProductReviews);
router.get("/all", isLoggedIn, authorize(authRoles.ADMIN), getAllReviews);
router.get("/:reviewId", getReviewById);

router.delete("/delete/:reviewId", isLoggedIn, authorize(authRoles.ADMIN, authRoles.USER), deleteReviewById);

export default router;