import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import config from "./config/index.js";
import routes from "./routes/index.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Morgan is a Middleware That Logs The Request in The Console
if (config.NODE_ENV === "dev") {
    app.use(morgan("tiny"));
}

// All routes here
app.use("/api", routes);
app.get("/api/config/paypal", (_req, res) => {
    res.status(200).json({
        success: true,
        clientId: config.PAYPAL_CLIENT_ID,
    });
});

if (config.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
} else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

app.get("/", (_req, res) => {
    res.send("Hello World");
});

app.all("*", (_req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((err, _req, res) => {
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

export default app;