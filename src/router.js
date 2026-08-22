import express from "express";
import {
    createNewPlayer,
    createNewRound,
    getRound,
} from "../controllers/controller.js";
import { addPlayerToRequest } from "./middlewares.js";

export const router = express.Router();

router.get("/init-game", async (req, res) => {
    try {
        const path = process.cwd() + "/public/index.html";
        res.sendFile(path);
    } catch (error) {
        throw error;
    }
});

router.get("/my-round", addPlayerToRequest, async (req, res) => {
    try {
        const { _id } = req.player;
        const hasRound = await getRound(_id.toString());
        return res.status(200).send(hasRound);
    } catch (error) {
        throw error;
    }
});

router.post("/start-game", async (req, res) => {
    try {
        const newPlayerId = await createNewPlayer(req, res);
        res.status(201).send(newPlayerId);
    } catch (error) {
        throw error;
    }
});

router.post("/start-round", addPlayerToRequest, async (req, res) => {
    try {
        const newRound = await createNewRound(req, res);
        res.status(201).send(newRound);
    } catch (error) {
        throw error;
    }
});

router.post("/hit", async (req, res) => {});

router.post("/stand", async (req, res) => {});
