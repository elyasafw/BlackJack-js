import express from "express";
import { createNewPlayer } from "./controllers/controller.js";

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const path = process.cwd() + "/index.html";
        res.sendFile(path);
    } catch (error) {
        res.status(500).json({ error: `internal server error: ${error}` });
    }
});

router.get("/my-round", async (req, res) => {});

router.post("/start-game", async (req, res) => {
    try {
        const newPlayerId = await createNewPlayer(req, res);
        res.status(201).send(newPlayerId);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/hit", async (req, res) => {});

router.post("/stand", async (req, res) => {});
