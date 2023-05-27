import React from "react";
import { GameResult } from "types/game/game";

interface GameResultTitleProps {
	gameResult: GameResult;
}

const GameResultTitle: React.FC<GameResultTitleProps> = ({ gameResult }) => {
	const getTitleAndColor = () => {
		switch (gameResult) {
			case GameResult.Win:
				return {
					title: "You won!",
					color: "text-silver-tree",
				};
			case GameResult.Lose:
				return {
					title: "You lost!",
					color: "text-tamarillo-400",
				};
			case GameResult.Equal:
				return {
					title: "It's a tie!",
					color: "text-athens-gray",
				};
			default:
				return {
					title: "",
					color: "",
				};
		}
	};

	const { title, color } = getTitleAndColor();

	return <h1 className={`text-4xl font-bold ${color}`}>{title}</h1>;
};

export { GameResultTitle };
