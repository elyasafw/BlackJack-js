const main = document.getElementById("main");
const API = "http://localhost:3000";
const CARDS_API = "https://deckofcardsapi.com/static/img/";
const KEY = "playerId";

const pages = {
    startDisplay: document.getElementById("startDisplay"),
    prosessGame: document.getElementById("prosessGame"),
};

pages.prosessGame.remove();
pages.startDisplay.remove();

function renderRoundToUI(round) {
    main.append(pages.prosessGame);

    const sumBet = document.getElementById("sumBet");
    sumBet.textContent = round.bet;

    const sumCards = document.getElementById("sumCards");
    sumCards.textContent = calculateCards(round.playerCards);

    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("dealerCards").innerHTML = "";

    const dealerCardsToDisplay = [...round.dealerCards];
    if (dealerCardsToDisplay.length === 1) {
        dealerCardsToDisplay.push({ rank: "back" });
    }

    addCardsToTable(round.playerCards, "playerCards");
    addCardsToTable(dealerCardsToDisplay, "dealerCards");
}

async function listenedToButtons(/**@type {Event} */ event) {
    event.preventDefault();
    const button = event.target.closest("button");
    if (!button) return;

    switch (button.id) {
        case "sendBet": {
            const newRound = await startRound();
            if (!newRound) return;

            renderRoundToUI(newRound);
            break;
        }
    }
}

async function startGame() {
    const respons = await fetch(API + "/start-game", {
        method: "POST",
    });
    const data = await respons.json();
    localStorage.setItem(KEY, data.playerId);
}

async function startRound() {
    const input = document.querySelector("#inputBet");
    const bet = input.value;
    const playerId = localStorage.getItem(KEY);

    const respons = await fetch(API + "/start-round", {
        method: "POST",
        headers: {
            "x-player-id": playerId,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bet: bet }),
    });

    const round = await respons.json();
    if (round.error) {
        const errorMsg = document.getElementById("msg");
        errorMsg.textContent = round.error;
        const inputForm = document.getElementById("getBet");
        inputForm.append(errorMsg);
        return;
    }
    round.bet = bet;
    return round;
}

function createImgsForCards(card) {
    const { rank, suit } = card;
    let path = "";
    if (!suit) {
        path = "back";
    } else {
        path = (rank === "10" ? "0" : rank) + suit[0];
    }
    const cardUrl = `${CARDS_API}/${path}.png`;
    const cardElement = document.createElement("img");
    cardElement.src = cardUrl;
    return cardElement;
}

function addCardsToTable(cards, participants) {
    const participant = document.getElementById(participants);
    cards.forEach((card) => {
        const newImgElement = createImgsForCards(card);
        newImgElement.className = "card";
        participant.append(newImgElement);
    });
}

function calculateCards(cards) {
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

async function initGame() {
    const playerId = localStorage.getItem(KEY);
    if (!playerId) {
        await startGame();
        return;
    }
    try {
        const response = await fetch(API + "/my-round", {
            method: "GET",
            headers: {
                "x-player-id": playerId,
            },
        });
        if (response.ok) {
            const round = await response.json();
            console.info("נתונים שהתקבלו מהשרת:", round);
            if (round && round.round === null) {
                return;
            }
            if (round && round.playerCards) {
                renderRoundToUI(round);
            }
        } else {
            localStorage.removeItem(KEY);
            await startGame();
        }
    } catch (error) {
        console.error("שגיאת מערכת בזמן טעינת המשחק:", error);
    }
}

initGame();
main.addEventListener("click", listenedToButtons);
