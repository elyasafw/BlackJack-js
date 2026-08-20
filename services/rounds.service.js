import roundsRepo from "../repository/rounds.repo.js";

function createRoundService(repository) {
    function drawcards() {
        const RANKS = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
        ];
        const SUITS = ["Heart", "Diamond", "Club", "Spade"];
        return {
            rank: RANKS[Math.floor(Math.random() * RANKS.length)],
            suit: SUITS[Math.floor(Math.random() * SUITS.length)],
        };
    }
    return { drawcards };
}

const roundsService = createRoundService(roundsRepo);

export default roundsService;
