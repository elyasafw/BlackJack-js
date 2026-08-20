import playersRepo from "../repository/players.repo.js";

export async function addPlayerToRequest(req, res, next) {
    const playerId = req.headers["x-player-id"];
    if (!playerId) {
        return res.status(401).send("Unauthorized: Missing x-player-id header");
    }
    const player = await playersRepo.findPlayer(playerId);
    if (!player) {
        return res.status(401).send("Unauthorized: Player not found");
    }
    req.player = player;
    next();
}
