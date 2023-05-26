import useKeyboardControls from "hooks/game/useKeyboardControls";
import useTouchControls from "hooks/game/useTouchControls";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { emitGameSocketEvent } from "sockets/socket";
import { RootState } from "types/global/global";
interface GameProps {}

const Game: React.FC<GameProps> = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const game = useSelector((state: RootState) => state.GAME.game);
	const countDown = useSelector(
		(state: RootState) => state.GAME.game?.countDown || 0
	);

	// custom hooks
	useTouchControls(countDown, emitGameSocketEvent);
	useKeyboardControls(countDown, emitGameSocketEvent);

	const requestAnimationRef = useRef<number>(0);

	const tempCanvasRef = useRef<any | null>(null);

	useEffect(() => {
		tempCanvasRef.current = document.createElement("canvas");
	}, []);

	const animateGame = useCallback(
		(time: any) => {
			console.log("animateGame");
			if (!game || !tempCanvasRef.current) return;
			const canvas = canvasRef.current;
			if (!canvas) return;

			const logicalWidth = game.width;
			const logicalHeight = game.height;
			const rect = canvas.getBoundingClientRect();

			console.log(rect.width, rect.height);

			const scale = Math.min(
				rect.width / logicalWidth,
				rect.height / logicalHeight
			);

			console.log("scale", scale);

			canvas.width = logicalWidth * scale;
			canvas.height = logicalHeight * scale;

			const context = canvas.getContext("2d");
			if (!context) return;

			context.scale(scale, scale);

			// Création d'un canvas temporaire pour le dessin inversé
			const tempCanvas = tempCanvasRef.current;
			tempCanvas.width = logicalWidth;
			tempCanvas.height = logicalHeight;

			const tempContext = tempCanvas.getContext("2d");
			if (!tempContext) return;

			if (!game.isLeftPlayer) {
				tempContext.scale(-1, 1);
				tempContext.translate(-logicalWidth, 0);
			}

			tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

			tempContext.beginPath();
			tempContext.strokeStyle = "#c5bda2";
			tempContext.setLineDash([5, 15]);
			tempContext.moveTo(logicalWidth / 2, 0);
			tempContext.lineTo(logicalWidth / 2, logicalHeight);
			tempContext.stroke();

			tempContext.fillStyle = "#4F609C";

			tempContext.fillRect(
				game.paddle1.x,
				game.paddle1.y,
				game.paddle1.width,
				game.paddle1.height
			);

			tempContext.fillRect(
				game.paddle2.x,
				game.paddle2.y,
				game.paddle2.width,
				game.paddle2.height
			);

			tempContext.beginPath();
			tempContext.fillStyle = "white";
			tempContext.arc(
				game.ball.x,
				game.ball.y,
				game.ball.radius,
				0,
				Math.PI * 2
			);
			tempContext.fill();

			// game.PowerUpBalls.forEach((ball: PowerUpBall) => {
			// 	tempContext.beginPath();
			// 	tempContext.fillStyle = "red";
			// 	if (ball.type === PowerUpType.PaddleSizeUp)
			// 		tempContext.fillStyle = "green";
			// 	else if (ball.type === PowerUpType.PaddleSizeDown)
			// 		tempContext.fillStyle = "red";
			// 	else if (ball.type === PowerUpType.BallSizeUp)
			// 		tempContext.fillStyle = "blue";
			// 	else if (ball.type === PowerUpType.BallSizeDown)
			// 		tempContext.fillStyle = "yellow";
			// 	tempContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
			// 	tempContext.fill();
			// });

			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(tempCanvas, 0, 0);

			// Dessiner le score sur le canvas original, après avoir dessiné l'image temporaire
			context.font = "35px Arial ";
			context.fillStyle = "white";
			const player1Score = game.isLeftPlayer
				? game.score.player1Score
				: game.score.player2Score;
			const player2Score = game.isLeftPlayer
				? game.score.player2Score
				: game.score.player1Score;

			context.fillText(player1Score.toString(), logicalWidth / 4, 50);
			context.fillText(
				player2Score.toString(),
				(3 * logicalWidth) / 4,
				50
			);

			requestAnimationRef.current = requestAnimationFrame(animateGame);
		},
		[game]
	);

	useEffect(() => {
		console.log("animateGame");

		if (game && tempCanvasRef.current) {
			requestAnimationRef.current = requestAnimationFrame(animateGame);
		}
		return () => {
			cancelAnimationFrame(requestAnimationRef.current);
		};
	}, [game, animateGame]);

	return (
		<div className="flex w-full flex-col justify-center items-center  p-4 max-h-full">
			<div
				style={{
					aspectRatio: "14/10",
				}}
				className="relative bg-oxford-blue w-full max-w-7xl rounded-lg shadow-lg overflow-auto"
			>
				{countDown > 0 && (
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl">
						{countDown}
					</div>
				)}
				<canvas
					ref={canvasRef}
					style={{
						width: "100%",
						height: "100%",
					}}
				></canvas>
			</div>
		</div>
	);
};

export { Game };
// NEW
