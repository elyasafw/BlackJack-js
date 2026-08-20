const main = document.getElementById("main");
const API = "http://localhost:3000";
const CARDS_API = "https://deckofcardsapi.com/static/img/";
const KEY = "playerId";

const pages = {
    startDisplay: document.getElementById("startDisplay"),
    prosessGame: document.getElementById("prosessGame"),
};

pages.prosessGame.remove();

async function listenedToButtons(/**@type {Event} */ event) {
    event.preventDefault();
    const button = event.target.closest("button");
    if (!button) return;

    switch (button.id) {
        case "sendBet": {
            const newRound = await startRound();
            if (!newRound) return;
            main.append(pages.prosessGame);
            const backCard = {
                rank: "back",
            };
            const sumBet = document.getElementById("sumBet");
            sumBet.textContent = newRound.bet;
            newRound.dealerCards.push(backCard);
            addCardsToTable(newRound.playerCards, "playerCards");
            addCardsToTable(newRound.dealerCards, "dealerCards");
            break;
        }
    }
}

async function startGame() {
    const respons = await fetch("/start-game", {
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
        inputForm.reset();
        return;
    }
    round.bet = bet;
    pages.startDisplay.remove();
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

main.addEventListener("click", listenedToButtons);
if (!localStorage.getItem(KEY)) {
    startGame();
} else {
    startRound();
}
