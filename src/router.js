import express from "express";
import { createNewPlayer, createNewRound } from "../controllers/controller.js";
import { addPlayerToRequest } from "./middlewares.js";

export const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const path = process.cwd() + "/public/index.html";
        res.sendFile(path);
    } catch (error) {
        return es
            .status(500)
            .json({ error: `internal server error: ${error}` });
    }
});

router.get("/my-round", async (req, res) => {});

router.post("/start-game", async (req, res) => {
    try {
        const newPlayerId = await createNewPlayer(req, res);
        res.status(201).send(newPlayerId);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/start-round", addPlayerToRequest, async (req, res) => {
    const newRound = await createNewRound(req, res);
    res.status(201).send(newRound);
});

router.post("/hit", async (req, res) => {});

router.post("/stand", async (req, res) => {});
