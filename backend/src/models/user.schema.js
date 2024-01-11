import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

import config from '../config/index.js';
import authRoles from "../utils/authRoles.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: Number,
        default: authRoles.USER,
        enum: Object.values(authRoles)
    }
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre("save", async function (next) {
    // Only run this function if password was moddified (not on other update functions)
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods = {
    // Compare Password For Login
    comparePassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },

    // Get JWT Token
    getJWTToken: function () {
        const token = JWT.sign({ _id: this._id, role: this.role, email: this.email }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });
        return token;
    }
};

export default mongoose.model("User", userSchema);