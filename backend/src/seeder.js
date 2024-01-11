import mongoose from "mongoose";

import users from "./data/users.js";
import categories from "./data/categories.js";
import products from "./data/products.js";

import User from "./models/user.schema.js";
import Product from "./models/product.schema.js";
import Order from "./models/order.schema.js";
import Category from "./models/category.schema.js";
import Review from "./models/review.schema.js";

import config from "./config/index.js";

const destroyData = async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);

        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();
        await Category.deleteMany();
        await Review.deleteMany();

        await User.collection.dropIndexes();
        await Product.collection.dropIndexes();
        await Order.collection.dropIndexes();
        await Category.collection.dropIndexes();
        await Review.collection.dropIndexes();

        await User.collection.drop();
        await Product.collection.drop();
        await Order.collection.drop();
        await Category.collection.drop();
        await Review.collection.drop();
        
        await mongoose.connection.close();
        console.log("Data Destroyed!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const importData = async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);

        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await Category.deleteMany();
        await Review.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const createdCategories = await Category.insertMany(categories);
        const electronicsCategory = createdCategories[0]._id;
        const clothesCategory = createdCategories[1]._id;

        const sampleProducts = products.map((product) => {
            if (product.category === "Electronics") {
                return { ...product, user: adminUser, category: electronicsCategory };
            } else if (product.category === "Clothes") {
                return { ...product, user: adminUser, category: clothesCategory };
            }
        });

        await Product.insertMany(sampleProducts);

        console.log("Data Imported!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}