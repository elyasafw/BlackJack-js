import playersRepo from "../repository/players.repo.js";

export function createNewPlayer(_req, res) {
    const STARTING_CHIPS = 1000;
    const newPlayer = {
        chips: STARTING_CHIPS,
        createdAt: new Date().toLocaleDateString("he-IL"),
    };
    return playersRepo.createPlayer(newPlayer);
}
