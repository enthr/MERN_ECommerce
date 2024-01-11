import Product from "../models/product.schema.js";
import Category from "../models/category.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import customError from "../utils/customError.js";
import config from "../config/index.js";

/**********************************************************
 * @GET_ALL_PRODUCTS
 * @route [Server_URL]/api/product/all
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 * @access Public
 *********************************************************/
export const getAllProducts = asyncHandler(async (req, res) => {
    const pageSize = config.PAGINATION_LIMIT;
    const page = Number(req.query.page) || 1;
    const count = await Product.countDocuments();

    const products = await Product.find({}).populate("category", "name").limit(pageSize).skip(pageSize * (page - 1));

    if (!products) {
        throw new customError("No Products Found", 404);
    }

    res.status(200).json({
        success: true,
        products: products,
        page: page,
        pages: Math.ceil(count / pageSize)
    });
});

/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route [Server_URL]/api/product/:productId
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 * @access Public
 *********************************************************/
export const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("category", "name").populate({
        path: "reviews",
        populate: {
            path: "user",
            select: "name email"
        }
    });

    if (!product) {
        throw new customError("No Product Found", 404);
    }

    res.status(200).json({
        success: true,
        product: product
    });
});

/******************************************************
 * @CREATE_PRODUCT
 * @route [Server_URL]/api/product/create
 * @description Product Create Controller for Creating New Product
 * @returns Product Object
 * @access Admin
 ******************************************************/
export const createProduct = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ name: "Clothes" });

    if (!category) {
        throw new customError("Category Not Found", 404);
    }

    const product = await Product.create({
        name: "Sample Name",
        image: "/images/sample.jpg",
        brand: "Sample Brand",
        category: category._id,
        description: "Sample Description",
        price: 500,
        countInStock: 100,
        user: req.user._id
    });

    if (!product) {
        throw new customError("Product Not Created", 500);
    }

    res.status(200).json({
        success: true,
        product: product
    });
});

/******************************************************
 * @UPDATE_PRODUCT_BY_ID
 * @route [Server_URL]/api/product/update/:productId
 * @description Product Update Controller for Updating Product
 * @returns Product Object
 * @access Admin
 ******************************************************/
export const updateProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, image, brand, category, description, price, countInStock } = req.body;

    if (!name || !image || !brand || !category || !description || !price || !countInStock) {
        throw new customError("Please Enter All Fields", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new customError("Product Not Found", 404);
    }

    if (name !== product.name) {
        product.name = name;
    }

    if (image !== product.image) {
        product.image = image;
    }

    if (brand !== product.brand) {
        product.brand = brand;
    }

    if (category !== product.category) {
        product.category = category;
    }

    if (description !== product.description) {
        product.description = description;
    }

    if (price !== product.price) {
        product.price = price;
    }

    if (countInStock !== product.countInStock) {
        product.countInStock = countInStock;
    }

    const updatedProduct = await product.save();

    if (!updatedProduct) {
        throw new customError("Product Not Updated", 500);
    }

    res.status(200).json({
        success: true,
        product: updatedProduct
    });
});

/**********************************************************
 * @DELTE_PRODUCT_BY_ID
 * @route [Server_URL]/api/product/delete/:productId
 * @description Product Delete Controller For Deleting Product
 * @returns Success Message
 * @access Admin
 **********************************************************/
export const deleteProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
        throw new customError("Product Not Deleted", 500);
    }

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});

/**********************************************************
 * @SEARCH_PRODUCTS
 * @route [Server_URL]/api/product/search
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 * @access Public
 *********************************************************/
export const searchProducts = asyncHandler(async (req, res) => {
    const pageSize = config.PAGINATION_LIMIT;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: "i"
        }
    } : {
        name: {
            $regex: "",
            $options: "i"
        }
    };
    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword }).populate("category", "name").limit(pageSize).skip(pageSize * (page - 1));

    if (!products) {
        throw new customError("No Products Found", 404);
    }

    res.status(200).json({
        success: true,
        products: products,
        page: page,
        pages: Math.ceil(count / pageSize)
    });
});

/**********************************************************
 * @GET_TOP_PRODUCTS
 * @route [Server_URL]/api/product/top
 * @description Controller Used For Getting Top Products
 * @description User and Admin Can Get Top Products
 * @returns Products Object
 * @access Public
 *********************************************************/
export const getTopProducts = asyncHandler(async (_req, res) => {
    const products = await Product.find({}).populate("category", "name").sort({ rating: -1 }).limit(3);

    if (!products) {
        throw new customError("No Products Found", 404);
    }

    res.status(200).json({
        success: true,
        products: products
    });
});