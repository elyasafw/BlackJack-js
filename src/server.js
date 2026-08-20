import cors from "cors";
import "dotenv/config";
import express from "express";
import { router } from "./router.js";

const PORT = process.env.PORT;

const server = express();

server.use(express.static("./public"), cors(), express.json());

server.use(router);

server.use((err, req, res, next) => {
    console.error("Error caught by Middleware:", err);
    const statusCode = err.status || 500;
    const errorMessage = err.message || "שגיאת שרת פנימית ..";
    return res.status(statusCode).send({
        error: errorMessage,
    });
});

server.listen(PORT, () => {
    console.log(`server running on: http://localhost:${PORT}`);
});
