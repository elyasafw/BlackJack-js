export function validateNewRound(data) {
    const { bet, player, round } = data;
    if (bet === 0 || !bet >= player.chips) {
        const error = new Error(
            "ההימור חייב להיות גדול מ 0 ולשחקן צריכה להיות יתרת אסימונים מספיקה",
        );
        error.status = 400;
        throw error;
    }
    if (round?.status) {
        const error = new Error("יש כבר סבב פעיל!");
        error.status = 409;
        throw error;
    }
}
