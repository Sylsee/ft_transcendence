import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { emitGameSocketEvent } from "sockets/socket";
import { GameDirection, GameSendEvent } from "types/game/game";
import { RootState } from "types/global/global";

interface GameProps {}

const Game: React.FC<GameProps> = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const game = useSelector((state: RootState) => state.GAME.game);
	const countDown = useSelector(
		(state: RootState) => state.GAME.game?.countDown || 0
	);

	useEffect(() => {
		if (!game) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		const handleResize = () => {
			const logicalWidth = game.width;
			const logicalHeight = game.height;

			const rect = canvas.getBoundingClientRect();

			const scale = Math.min(
				rect.width / logicalWidth,
				rect.height / logicalHeight
			);

			canvas.width = logicalWidth * scale;
			canvas.height = logicalHeight * scale;

			const context = canvas.getContext("2d");
			if (!context) return;

			context.scale(scale, scale);

			// Création d'un canvas temporaire pour le dessin inversé
			const tempCanvas = document.createElement("canvas");
			tempCanvas.width = logicalWidth;
			tempCanvas.height = logicalHeight;
			const tempContext = tempCanvas.getContext("2d");
			if (!tempContext) return;

			// Inverser le canvas temporaire si le joueur n'est pas le joueur de gauche
			if (!game.isLeftPlayer) {
				tempContext.scale(-1, 1);
				tempContext.translate(-logicalWidth, 0);
			}

			tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height); // Effacer le canvas temporaire

			// Dessiner une ligne pointillée au milieu
			tempContext.beginPath();
			tempContext.strokeStyle = "white";
			tempContext.setLineDash([5, 15]);
			tempContext.moveTo(logicalWidth / 2, 0);
			tempContext.lineTo(logicalWidth / 2, logicalHeight);
			tempContext.stroke();

			tempContext.fillStyle = "white";

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
			tempContext.arc(
				game.ball.x,
				game.ball.y,
				game.ball.radius,
				0,
				Math.PI * 2
			);
			tempContext.fill();

			// Copier l'image du canvas temporaire sur le canvas original
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(tempCanvas, 0, 0);

			// Dessiner le score sur le canvas original, après avoir dessiné l'image temporaire
			context.font = "35px Arial ";
			context.fillStyle = "white";
			const player1Score = game.isLeftPlayer
				? game.score.player2Score
				: game.score.player1Score;
			const player2Score = game.isLeftPlayer
				? game.score.player1Score
				: game.score.player2Score;

			context.fillText(player1Score.toString(), logicalWidth / 4, 50);
			context.fillText(
				player2Score.toString(),
				(3 * logicalWidth) / 4,
				50
			);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [game]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (countDown !== 0) return;

			switch (event.key) {
				case "ArrowUp":
					emitGameSocketEvent(GameSendEvent.MovePaddle, {
						direction: GameDirection.Up,
					});
					break;
				case "ArrowDown":
					emitGameSocketEvent(GameSendEvent.MovePaddle, {
						direction: GameDirection.Down,
					});
					break;
				default:
					break;
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (countDown !== 0) return;

			switch (event.key) {
				case "ArrowUp":
				case "ArrowDown":
					emitGameSocketEvent(GameSendEvent.MovePaddle, {
						direction: GameDirection.None,
					});
					break;
				default:
					break;
			}
		};

		let initialTouchY: number | null = null;
		let lastDirection: GameDirection = GameDirection.None;

		const handleTouchStart = (event: TouchEvent) => {
			if (countDown !== 0) return;
			initialTouchY = event.touches[0].clientY;
		};

		const handleTouchMove = (event: TouchEvent) => {
			if (countDown !== 0 || initialTouchY === null) return;

			const currentTouchY = event.touches[0].clientY;
			if (currentTouchY < initialTouchY) {
				lastDirection = GameDirection.Up;
				emitGameSocketEvent(GameSendEvent.MovePaddle, {
					direction: GameDirection.Up,
				});
			} else if (currentTouchY > initialTouchY) {
				lastDirection = GameDirection.Down;
				emitGameSocketEvent(GameSendEvent.MovePaddle, {
					direction: GameDirection.Down,
				});
			}

			initialTouchY = currentTouchY;
		};

		const handleTouchEnd = (event: TouchEvent) => {
			if (countDown !== 0 || initialTouchY === null) return;
			if (lastDirection !== GameDirection.None) {
				emitGameSocketEvent(GameSendEvent.MovePaddle, {
					direction: GameDirection.None,
				});
			}
			initialTouchY = null;
			lastDirection = GameDirection.None;
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("touchstart", handleTouchStart);
		window.addEventListener("touchmove", handleTouchMove);
		window.addEventListener("touchend", handleTouchEnd);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleTouchEnd);
		};
	}, [countDown]);

	useEffect(() => {
		let initialTouchY: number | null = null;
		let lastDirection: GameDirection = GameDirection.None;

		const handleTouchStart = (event: TouchEvent) => {
			if (countDown !== 0) return;
			initialTouchY = event.touches[0].clientY;
		};

		const handleTouchMove = (event: TouchEvent) => {
			if (countDown !== 0 || initialTouchY === null) return;

			const currentTouchY = event.touches[0].clientY;
			if (currentTouchY < initialTouchY) {
				lastDirection = GameDirection.Up;
				emitGameSocketEvent(GameSendEvent.MovePaddle, {
					direction: GameDirection.Up,
				});
			} else if (currentTouchY > initialTouchY) {
				lastDirection = GameDirection.Down;
				emitGameSocketEvent(GameSendEvent.MovePaddle, {
					direction: GameDirection.Down,
				});
			}

			initialTouchY = currentTouchY;
		};

		const handleTouchEnd = (event: TouchEvent) => {
			if (countDown !== 0 || initialTouchY === null) return;
			if (lastDirection !== GameDirection.None) {
				emitGameSocketEvent(GameSendEvent.MovePaddle, {
					direction: GameDirection.None,
				});
			}
			initialTouchY = null;
			lastDirection = GameDirection.None;
		};

		window.addEventListener("touchstart", handleTouchStart);
		window.addEventListener("touchmove", handleTouchMove);
		window.addEventListener("touchend", handleTouchEnd);

		return () => {
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleTouchEnd);
		};
	}, [countDown]);
	return (
		<div className="flex flex-col justify-center items-center w-full p-4">
			<div
				style={{
					aspectRatio: "14/10",
				}}
				className="relative border-2  w-full max-w-7xl"
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
						border: "2px solid black",
					}}
				></canvas>
			</div>
		</div>
	);
};

export { Game };
