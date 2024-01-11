import dotenv from "dotenv";

dotenv.config();

const config = {
    NODE_ENV: process.env.NODE_ENV || "dev",
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_APP_SECRET: process.env.PAYPAL_APP_SECRET,
    PAYPAL_API_URL: process.env.PAYPAL_API_URL,
    PAGINATION_LIMIT: process.env.PAGINATION_LIMIT || 10,
};

export default config;