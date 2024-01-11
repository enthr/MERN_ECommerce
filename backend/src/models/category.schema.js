import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [120, "Category Name Should Not Exceed 120 Characters."]
    }
}, { timestamps: true });

categorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.name = this.name.toUpperCase();
    }
    next();
});

export default mongoose.model("Category", categorySchema);