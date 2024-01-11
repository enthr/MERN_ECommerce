import User from "../models/user.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";
import authRoles from "../utils/authRoles.js";

const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true
};

/******************************************************
 * @REGISTER
 * @route [Server_URL]/api/user/register
 * @description User Register Controller for Creating New User
 * @returns User Object
 * @access Public
 ******************************************************/
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new customError("Please Fill All The Fields", 400);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new customError("User Already Exists", 400);
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: authRoles.USER
    });

    const token = user.getJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        token: token,
        user: user
    });
});

/*********************************************************
 * @LOGIN
 * @route [Server_URL]/api/user/login
 * @description User Login Controller for signing in the user
 * @returns User Object
 * @access Public
 *********************************************************/
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError("Please Fill All The Fields", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new customError("Invalid Credentials", 400);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched) {
        const token = user.getJWTToken();
        user.password = undefined;
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({
            success: true,
            token: token,
            user: user
        });
    } else {
        throw new customError("Password is Incorrect", 400);
    }
});

/**********************************************************
 * @LOGOUT
 * @route [Server_URL]/api/user/logout
 * @description User Logout Controller for logging out the user
 * @description Removes token from cookies
 * @returns Success Message with "Logged Out"
 * @access Private
 **********************************************************/
export const logout = asyncHandler(async (_req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});

/**********************************************************
 * @GET_PROFILE
 * @route [Server_URL]/api/user/profile
 * @description check token in cookies, if present then returns user details
 * @returns Logged In User Details
 * @access Private
 **********************************************************/
export const getProfile = asyncHandler(async (req, res) => {
    const { user } = req;

    if (!user) {
        throw new customError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        user: user
    });
});

/**********************************************************
 * @UPDATE_PROFILE
 * @route [Server_URL]/api/user/profile/update
 * @description Check token in Cookies, if Present Then Updates User Details
 * @returns Updated User Details
 * @access Private
 **********************************************************/
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new customError("Please Fill All Required Fields", 400);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new customError("User Not Found", 404);
    }

    if (name !== user.name) {
        user.name = name;
    }

    if (email !== user.email) {
        user.email = email;
    }

    if (password !== user.password) {
        user.password = password; 
    }

    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        user: updatedUser
    });
});

/**********************************************************
 * @GET_USERS
 * @route [Server_URL]/api/user/all
 * @description Check Role of Logged In User, if Admin then Returns All Users
 * @returns All Users
 * @access Admin
 **********************************************************/
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users: users
    });
});

/**********************************************************
 * @GET_USER_BY_ID
 * @route [Server_URL]/api/user/:userId
 * @description Check Role of Logged In User, if Admin then Returns User By Id
 * @returns User Details of Corresponding Id
 * @access Admin
 **********************************************************/
export const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userToGet = await User.findById(userId);

    res.status(200).json({
        success: true,
        userDetails: userToGet
    });
});

/**********************************************************
 * @UPDATE_USER_BY_ID
 * @route [Server_URL]/api/user/update/:userId
 * @description Check Role of Logged In User, if Admin then Updates User
 * @returns Updated User Details
 * @access Admin
 **********************************************************/
export const updateUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        throw new customError("Please Fill All Required Fields", 400);
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new customError("User Not Found", 404);
    }

    if (name !== user.name) {
        user.name = name;
    }

    if (email !== user.email) {
        user.email = email;
    }

    if (password !== user.password) {
        user.password = password;
    }

    if (role !== user.role) {
        user.role = role;
    }
    
    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(200).json({
        success: true,
        userDetails: updatedUser
    });
});

/**********************************************************
 * @DELTE_USER_BY_ID
 * @route [Server_URL]/api/user/delete/:userId
 * @description Check Role of Logged In User, if Admin then Deletes User
 * @returns Success Message
 * @access Admin
 **********************************************************/
export const deleteUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
        throw new customError("User Not Found", 404);
    }

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});