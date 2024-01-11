import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);