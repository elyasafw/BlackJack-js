import { ObjectId } from "mongodb";
import blackjackDB from "../db/db.config.js";

const players = blackjackDB.collection("players");

export function createPlayersRepo(collection) {
    async function createPlayer(player) {
        const { insertedId } = await collection.insertOne(player);
        return insertedId.toString();
    }

    async function updateChips(playerId, bet) {
        const { chips } = await collection.findOneAndUpdate(
            { _id: new ObjectId(playerId) },
            { $inc: { chips: bet } },
            { returnDocument: "after" },
        );
        return chips;
    }

    async function findPlayer(playerId) {
        const player = await collection.findOne({
            _id: new ObjectId(playerId),
        });
        return player;
    }
    return { createPlayer, updateChips, findPlayer };
}

const playersRepo = createPlayersRepo(players);

export default playersRepo;
