function createRoundService() {
    function drawcards() {
        // prettier-ignore
        const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A",];
        const SUITS = ["Heart", "Diamond", "Club", "Spade"];
        return {
            rank: RANKS[Math.floor(Math.random() * RANKS.length)],
            suit: SUITS[Math.floor(Math.random() * SUITS.length)],
        };
    }

    function calculateHandValue(cards) {
        // prettier-ignore
        const values = {
        "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, 
        "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11
    };

        let acesCount = 0;
        let total = cards.reduce((acc, cur) => {
            const cardValue = values[cur.rank] || 0;
            if (cur.rank === "A") acesCount++;
            return acc + cardValue;
        }, 0);

        while (total > 21 && acesCount > 0) {
            total -= 10;
            acesCount--;
        }

        return total;
    }

    async function checkBustStatus(round, participant) {
        const participantTotal = calculateHandValue(round[participant]);

        if (participantTotal > 21) {
            round.status =
                participant === "playerCards" ? "player_bust" : "dealer_bust";
            return round;
        }

        round.status = "in_progress";
        return round;
    }
    async function evaluateFinalWinner(round) {
        const playerTotal = calculateHandValue(round.playerCards);
        const dealerTotal = calculateHandValue(round.dealerCards);

        if (playerTotal === dealerTotal) {
            round.status = "push";
        } else if (playerTotal > dealerTotal) {
            round.status = "player_win";
        } else {
            round.status = "dealer_win";
        }
        return round;
    }

    return {
        drawcards,
        calculateHandValue,
        checkBustStatus,
        evaluateFinalWinner,
    };
}

const roundsService = createRoundService();

export default roundsService;
