import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";
import config from "../config/index.js";

// Autorization Middleware
export const authorize = (...requiredRoles) => asyncHandler(async (req, res, next) => {
    if(!requiredRoles.includes(req.user.role)) {
        throw new customError("You Are Not Authorized To Access This Route.", 403);
    }

    next();
});

// Authentication Middleware
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    let token = "";

    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        throw new customError("You Are Not Logged In.", 401);
    }

    try {
        const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decodedJWTPayload._id, "name email role");
        next();
    } catch (error) {
        throw new customError("You Are Not Logged In. Please Login", 401);
    }
});