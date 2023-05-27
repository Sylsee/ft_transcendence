import { GameResult } from "types/game/game";

export const getGameResult = (
	id: string,
	winnerId: string | undefined
): GameResult => {
	if (winnerId === undefined) return GameResult.Equal;

	if (id === winnerId) return GameResult.Win;
	return GameResult.Lose;
};
