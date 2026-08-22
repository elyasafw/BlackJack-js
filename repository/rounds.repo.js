import { ObjectId } from "mongodb";
import blackjackDB from "../db/db.config.js";

const rounds = blackjackDB.collection("rounds");

export function createRoundsRepo(collection) {
    async function createRound(round) {
        const { insertedId } = await rounds.insertOne(round);
        return insertedId.toString();
    }

    async function addCards(roundId, object) {
        const updatedRound = await rounds.findOneAndUpdate(
            { _id: new ObjectId(roundId) },
            { $push: object },
            { returnDocument: "after" },
        );
        return updatedRound;
    }

    async function addCardToPlayer(roundId, card) {
        return addCards(roundId, { playerCards: card });
    }

    async function addCardToDealer(roundId, card) {
        return addCards(roundId, { dealerCards: card });
    }

    async function updateStatus(roundId, status) {
        await rounds.updateOne(
            { _id: new ObjectId(roundId) },
            { $set: { status } },
        );
    }

    async function findRoundByPlayer(playerId) {
        const round = await rounds.findOne({
            playerId,
            status: "in_progress",
        });
        return round;
    }

    return {
        createRound,
        addCardToPlayer,
        addCardToDealer,
        findRoundByPlayer,
        updateStatus,
    };
}

const roundsRepo = createRoundsRepo(rounds);

export default roundsRepo;
