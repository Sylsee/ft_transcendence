import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { emitGameSocketEvent } from "sockets/socket";
import { GameDirection, GameSendEvent } from "types/game/game";
import { RootState } from "types/global/global";

interface GameProps {}

const Game: React.FC<GameProps> = ({}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const game = useSelector((state: RootState) => state.GAME.game);

	useEffect(() => {
		if (!game) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;

		canvas.width = 1400;
		canvas.height = 1000;

		context.fillRect(
			game.paddle1.x,
			game.paddle1.y,
			game.paddle1.width,
			game.paddle1.height
		);
		context.fillRect(
			game.paddle2.x,
			game.paddle2.y,
			game.paddle2.width,
			game.paddle2.height
		);

		// Dessiner la balle
		context.beginPath();
		context.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2); // Balle
		context.fill();
	}, [game]);

	if (!game) return null;
	return (
		<>
			<div className="flex flex-col p-4">
				<button
					className="border-2 p-2"
					onClick={() =>
						emitGameSocketEvent(GameSendEvent.MovePaddle, {
							direction: GameDirection.Up,
						})
					}
				>
					UP
				</button>
				<button
					className="border-2 p-2"
					onClick={() =>
						emitGameSocketEvent(GameSendEvent.MovePaddle, {
							direction: GameDirection.Down,
						})
					}
				>
					DOWN
				</button>
				<button
					className="border-2 p-2"
					onClick={() =>
						emitGameSocketEvent(GameSendEvent.MovePaddle, {
							direction: GameDirection.None,
						})
					}
				>
					NONE
				</button>
			</div>
			<canvas
				ref={canvasRef}
				style={{
					width: "1400",
					height: "1000px",
					border: "1px solid black",
				}}
			/>
		</>
	);
};

export { Game };
