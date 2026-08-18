import { MongoClient } from "mongodb";

const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI);

async function connectToDB() {
    try {
        await client.connect();
        const db = client.db("blackjack-game");
        console.log("Connecting to MongoDB ...");
        return db;
    } catch (error) {
        console.error(`Connected failed, error: ${error}`);
    }
}

const blackjackDB = await connectToDB();

export default blackjackDB;
