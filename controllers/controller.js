import playersRepo from "../repository/players.repo.js";
import roundsRepo from "../repository/rounds.repo.js";
import roundsService from "../services/rounds.service.js";
import { validateNewRound } from "../src/utils.js";

export async function createNewPlayer(_req, res) {
    const STARTING_CHIPS = 1000;
    const newPlayer = {
        chips: STARTING_CHIPS,
        createdAt: new Date().toLocaleDateString("he-IL"),
    };
    const newId = await playersRepo.createPlayer(newPlayer);
    return {
        playerId: newId,
        chips: STARTING_CHIPS,
    };
}

export async function createNewRound(req, res) {
    const bet = Number(req.body.bet);
    const player = req.player;
    const round = await roundsRepo.findRoundByPlayer(player._id);
    validateNewRound({
        bet,
        player,
        round,
    });
    const newData = {
        playerId: player._id.toString(),
        bet: bet,
        playerCards: [roundsService.drawcards(), roundsService.drawcards()],
        dealerCards: [roundsService.drawcards(), roundsService.drawcards()],
        status: "in_progress",
        createdAt: new Date().toLocaleDateString("he-IL"),
    };
    const newRoundId = await roundsRepo.createRound(newData);
    const currentChips = await playersRepo.updateChips(player._id, -bet);
    return {
        roundId: newRoundId,
        playerCards: newData.playerCards,
        dealerCards: [newData.dealerCards[1]],
        chips: currentChips,
    };
}
