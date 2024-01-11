import Review from "../models/review.schema.js";
import Product from "../models/product.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";
import authRoles from "../utils/authRoles.js";

import mongoose from "mongoose";

/**********************************************************
 * @CREATE_REVIEW
 * @route [Server_URL]/api/review/create
 * @description Controller used for creating a new review
 * @description User and Admin Can Create The Review
 * @returns Created Review Object
 * @access Private
 *********************************************************/
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
        throw new customError("Please Provide Product ID, Rating And Comment", 400);
    }

    if (rating < 0 || rating > 5) {
        throw new customError("Rating Must Be Between 0 And 5", 400);
    }

    const product = await Product.findById(productId).populate("reviews");

    if (!product) {
        throw new customError("Product Not Found", 404);
    }

    const alreadyReviewed = product.reviews.find(review => (new mongoose.Types.ObjectId(review.user)).equals(req.user._id));

    if (alreadyReviewed) {
        throw new customError("You Have Already Reviewed This Product", 400);
    }

    const review = await Review.create({
        user: req.user._id,
        product: new mongoose.Types.ObjectId(productId),
        rating: rating,
        comment: comment
    });

    if (!review) {
        throw new customError("Review Not Created", 500);
    }

    product.reviews.push(review._id);
    product.numReviews = product.reviews.length;
    if (product.rating === 0) {
        product.rating = rating;
    } else {
        product.rating = ((product.rating + rating) / 2).toFixed(2);
    }

    await product.save();

    res.status(200).json({
        success: true,
        message: "Review Created Successfully",
        review: review
    });
});

/**********************************************************
 * @UPDATE_REVIEW_BY_ID
 * @route [Server_URL]/api/review/update/:reviewId
 * @description Controller Used For Updating A Review
 * @description User and Admin Can Update The Review
 * @returns Updated Review Object
 * @access Private
 *********************************************************/
export const updateReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        throw new customError("Please Provide Rating And Comment", 400);
    }

    if (rating < 0 || rating > 5) {
        throw new customError("Rating Must Be Between 0 And 5", 400);
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new customError("Review Not Found", 404);
    }

    const product = await Product.findById(review.product).populate("reviews");

    if (!product) {
        throw new customError("Product Not Found", 404);
    }

    if (!(new mongoose.Types.ObjectId(req.user._id)).equals(review.user) && req.user.role !== authRoles.ADMIN) {
        throw new customError("You Are Not Authorized To Update This Review", 403);
    }

    if (rating !== review.rating) {
        review.rating = rating;
    }

    if (comment !== review.comment) {
        review.comment = comment;
    }

    const updatedReview = await review.save();

    if (!updatedReview) {
        throw new customError("Review Not Updated", 500);
    }

    if (product.rating === 0) {
        product.rating = rating;
    } else {
        product.rating = ((product.rating + rating) / 2).toFixed(2);
    }

    await product.save();

    res.status(200).json({
        success: true,
        message: "Review Updated Successfully",
        review: updatedReview
    });
});

/**********************************************************
 * @DELETE_REVIEW_BY_ID
 * @route [Server_URL]/api/review/delete/:reviewId
 * @description Controller Used For Deleting A Review
 * @description User and Admin Can Delete The Review
 * @returns Success Message
 * @access Private
 *********************************************************/
export const deleteReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    
    const review = await Review.findById(reviewId);

    const product = await Product.findById(review.product);

    if (!product) {
        throw new customError("Product Not Found", 404);
    }

    if (!review) {
        throw new customError("Review Not Found", 404);
    }

    product.reviews = product.reviews.filter(productReview => !(new mongoose.Types.ObjectId(productReview._id)).equals(review._id));
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();

    await review.deleteOne();

    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully"
    });
});

/**********************************************************
 * @GET_REVIEW_BY_ID
 * @route [Server_URL]/api/review/:reviewId
 * @description Controller Used For Getting A Review
 * @description User and Admin Can Get The Review
 * @returns Review Object
 * @access Private
 *********************************************************/
export const getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).populate("user", "name email");

    if (!review) {
        throw new customError("Review Not Found", 404);
    }

    res.status(200).json({
        success: true,
        review: review
    });
});

/**********************************************************
 * @GET_ALL_PRODUCT_REVIEWS
 * @route [Server_URL]/api/review/all/:productId
 * @description Controller Used For Getting All Reviews Of A Product
 * @description Get All Reviews of a Product
 * @returns Reviews Array
 * @access Public
 *********************************************************/
export const getAllProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate("user", "name email");

    if (!reviews) {
        throw new customError("No Reviews Found", 404);
    }

    res.status(200).json({
        success: true,
        reviews: reviews
    });
});

/**********************************************************
 * @GET_ALL_REVIEWS
 * @route [Server_URL]/api/review/all
 * @description Controller Used For Getting All Reviews
 * @description Get All Reviews
 * @returns Reviews Array
 * @access Admin
 *********************************************************/
export const getAllReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).populate("user", "name email");

    if (!reviews) {
        throw new customError("No Reviews Found", 404);
    }

    res.status(200).json({
        success: true,
        reviews: reviews
    });
});