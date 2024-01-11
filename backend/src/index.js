import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log("DB CONNECTED");

        app.on("error", (err) => {
            console.error("ERROR: ", err);
            throw err;
        });

        app.listen(config.PORT, () => {
            console.log(`Listening on Port ${config.PORT}`);
        });
    } catch (err) {
        console.error("ERROR: ", err);
        throw err;
    }
})();