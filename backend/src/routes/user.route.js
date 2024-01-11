import { Router } from "express";

import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import { 
    register, 
    login, 
    logout, 
    getProfile, 
    updateProfile, 
    getUsers, 
    getUserById, 
    updateUserById, 
    deleteUserById 
} from "../controllers/user.controller.js";
import authRoles from "../utils/authRoles.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isLoggedIn, logout);

router.put("/profile/update", isLoggedIn, updateProfile);
router.put("/update/:userId", isLoggedIn, authorize(authRoles.ADMIN), updateUserById);

router.get("/profile", isLoggedIn, getProfile);
router.get("/all", isLoggedIn, authorize(authRoles.ADMIN), getUsers);
router.get("/:userId", isLoggedIn, authorize(authRoles.ADMIN), getUserById);

router.delete("/delete/:userId", isLoggedIn, authorize(authRoles.ADMIN), deleteUserById);

export default router;