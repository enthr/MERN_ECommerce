import Category from "../models/category.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";

/**********************************************************
 * @CREATE_CATEGORY
 * @route [Server_URL]/api/category/create
 * @description Controller used for creating a new category
 * @description Only admin can create the category
 * @returns Created Category Object
 * @access Private
 *********************************************************/
export const createCategory = asyncHandler(async (_req, res) => {
    const category = await Category.create({
        name: "Sample Category"
    });

    res.status(200).json({
        success: true,
        category: category
    });
});

/*************************************************************
 * @UPDATE_CATEGORY
 * @route [Server_URL]/api/category/update/:categoryId
 * @description Controller for updating the category details
 * @description Only admin can update the category
 * @returns Updated Category Details Object
 * @access Private
 ************************************************************/
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { categoryId } = req.params;

    if (!name) {
        throw new customError("Category name is required", 400);
    }

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new customError("Category Not Found", 404);
    }

    if (name !== category.name) {
        category.name = name;
    }

    const updatedCategory = await category.save();

    if (!updatedCategory) {
        throw new customError("Category Not Updated", 500);
    }

    res.status(200).json({
        success: true,
        message: "Category Updated Successfully",
        category: updatedCategory
    });
});

/****************************************************
 * @DELETE_CATEGORY
 * @route [Server_URL]/api/category/delete/:categoryId
 * @description Controller for deleting the category
 * @description Only admin can delete the category
 * @returns Success Message
 * @access Private
 ****************************************************/
export const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
        throw new customError("Category Not Deleted", 500);
    }
    
    res.status(200).json({
        success: true,
        message: "Category Has Been Deleted Successfully",
    });
});

/***********************************************************
 * @GET_ALL_CATEGORIES
 * @route [Server_URL]/api/category/all
 * @description Controller for getting all categories list
 * @description Get All Categories List
 * @returns Category Object with available categories in DB
 * @access Public
 ***********************************************************/
export const getAllCategories = asyncHandler(async (_req, res) => {
    const category = await Category.find({});

    if (!category) {
        throw new customError("No Categories", 404);
    }

    res.status(200).json({
        success: true,
        category: category
    });
});

/**********************************************************
 * @GET_CATEGORY_BY_ID
 * @route [Server_URL]/api/category/:categoryId
 * @description Controller used for getting single category details
 * @description User and admin can get single category details
 * @returns Category Object
 * @access Public
 *********************************************************/
export const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new customError("No Product Found", 404);
    }

    res.status(200).json({
        success: true,
        category: category
    });
});