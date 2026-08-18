import { ObjectId } from "mongodb";
import blackjackDB from "../db/db.config.js";

const players = blackjackDB.collection("players");

function playersRepo() {
    async function createPlayer(player) {
        const { insertedId } = await players.insertOne(player);
        return insertedId.toString();
    }
    async function updateChips(playerId, bet) {
        const { chips } = await players.findOneAndUpdate(
            { _id: new ObjectId(playerId) },
            { $inc: { chips: -bet } },
            { returnDocument: "after" },
        );
        return chips;
    }
    async function findPlayer(playerId) {
        const player = await players.findOne({ _id: new ObjectId(playerId) });
        return player;
    }
    return { createPlayer, updateChips, findPlayer };
}
