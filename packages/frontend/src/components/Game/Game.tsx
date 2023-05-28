import useKeyboardControls from "hooks/game/useKeyboardControls";
import useTouchControls from "hooks/game/useTouchControls";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { emitGameSocketEvent } from "sockets/socket";
import { PowerUpBall, PowerUpType } from "types/game/game";
import { RootState } from "types/global/global";
interface GameProps {}

const Game: React.FC<GameProps> = () => {
	// svg paths
	const arrowDownSvg =
		"M15 30C14.5027 30 14.0257 29.8244 13.6742 29.5118L0.549143 17.8452C-0.183045 17.1943 -0.183045 16.139 0.549143 15.4882C1.28133 14.8373 2.46858 14.8373 3.20077 15.4882L13.125 24.3097L13.125 1.66667C13.125 0.746167 13.9644 0 15 0C16.0355 0 16.875 0.746167 16.875 1.66667L16.875 24.3097L26.7992 15.4882C27.5314 14.8373 28.7186 14.8373 29.4508 15.4882C30.1831 16.139 30.1831 17.1943 29.4508 17.8452L16.3258 29.5118C15.9742 29.8244 15.4972 30 15 30Z";

	const arrowUpSvg =
		"M15 0C15.4973 0 15.9743 0.1756 16.3258 0.48815L29.4509 12.1548C30.183 12.8057 30.183 13.861 29.4509 14.5118C28.7187 15.1627 27.5314 15.1627 26.7992 14.5118L16.875 5.69035V28.3333C16.875 29.2538 16.0356 30 15 30C13.9645 30 13.125 29.2538 13.125 28.3333V5.69035L3.20084 14.5118C2.46859 15.1627 1.28141 15.1627 0.54917 14.5118C-0.183057 13.861 -0.183057 12.8057 0.54917 12.1548L13.6742 0.48815C14.0258 0.1756 14.5028 0 15 0Z";

	// refs
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const requestAnimationRef = useRef<number>(0);
	const tempCanvasRef = useRef<any | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const canvasContainerRef = useRef<HTMLDivElement | null>(null);

	// state
	const scaleRef = useRef<number>(1);

	// redux
	const game = useSelector((state: RootState) => state.GAME.game);
	const countDown = game?.countDown || 0;

	// custom hooks
	useTouchControls(countDown, emitGameSocketEvent);
	useKeyboardControls(countDown, emitGameSocketEvent);

	// hooks
	useEffect(() => {
		tempCanvasRef.current = document.createElement("canvas");
	}, []);

	const previousCanvasWidth = useRef<number>(1);
	const previousCanvasHeight = useRef<number>(1);

	const animateGame = useCallback(() => {
		if (!game || !tempCanvasRef.current) return;
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const logicalWidth = game.width;
		const logicalHeight = game.height;

		if (
			rect.width !== previousCanvasWidth.current ||
			rect.height !== previousCanvasHeight.current
		) {
			scaleRef.current = Number(
				Math.min(
					rect.width / logicalWidth,
					rect.height / logicalHeight
				).toFixed(2)
			);
			previousCanvasWidth.current = rect.width;
			previousCanvasHeight.current = rect.height;
		}

		const scale = scaleRef.current;

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

		// Create a new Path2D object from the SVG path string
		const arrowDownPathObj = new Path2D(arrowDownSvg);
		const arrowUpPathObj = new Path2D(arrowUpSvg);

		game.PowerUpBalls.forEach((ball: PowerUpBall) => {
			tempContext.filter = `blur(10px)`;
			tempContext.beginPath();
			if (ball.type === PowerUpType.PaddleSizeUp)
				tempContext.fillStyle = "#6FC82A";
			else if (ball.type === PowerUpType.PaddleSizeDown)
				tempContext.fillStyle = "#E03B31";
			else if (ball.type === PowerUpType.BallSizeUp)
				tempContext.fillStyle = "#24A8D1";
			else if (ball.type === PowerUpType.BallSizeDown)
				tempContext.fillStyle = "#E3BB2C";
			tempContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
			tempContext.fill();

			tempContext.filter = `none`;
			tempContext.fillStyle = "white";
			tempContext.save();
			tempContext.translate(ball.x, ball.y);
			tempContext.translate(-15, -15); // Adjusted translation based on the SVG's original center
			if (
				ball.type === PowerUpType.PaddleSizeUp ||
				ball.type === PowerUpType.BallSizeUp
			) {
				tempContext.fill(arrowUpPathObj);
			} else if (
				ball.type === PowerUpType.PaddleSizeDown ||
				ball.type === PowerUpType.BallSizeDown
			) {
				tempContext.fill(arrowDownPathObj);
			}
			tempContext.restore();
		});

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(tempCanvas, 0, 0);

		context.font = "35px Arial ";
		context.fillStyle = "white";
		const player1Score = game.isLeftPlayer
			? game.score.player1Score
			: game.score.player2Score;
		const player2Score = game.isLeftPlayer
			? game.score.player2Score
			: game.score.player1Score;

		context.fillText(player1Score.toString(), logicalWidth / 4, 50);
		context.fillText(player2Score.toString(), (3 * logicalWidth) / 4, 50);

		requestAnimationRef.current = requestAnimationFrame(animateGame);
	}, [game]);

	useEffect(() => {
		if (game && tempCanvasRef.current) {
			requestAnimationRef.current = requestAnimationFrame(animateGame);
		}
		return () => {
			cancelAnimationFrame(requestAnimationRef.current);
		};
	}, [game, animateGame]);

	useEffect(() => {
		const canvas = canvasContainerRef.current;
		if (!canvas) return;
		const aspectRatio = 14 / 10;

		const resizeCanvas = () => {
			// Get the new window dimensions
			const containerWidth = containerRef.current?.offsetWidth;
			const containerHeight = containerRef.current?.offsetWidth;

			if (!containerWidth || !containerHeight) return;

			// Canvas can take more space
			if (
				canvas.offsetWidth < containerWidth &&
				canvas.offsetHeight < containerHeight
			) {
				if (containerWidth / containerHeight > aspectRatio) {
					// Window larger than tall
					canvas.style.height = `${containerHeight}px`;
					canvas.style.width = `${containerHeight * aspectRatio}px`;
				} else {
					// Window taller than large
					canvas.style.height = `${containerWidth / aspectRatio}px`;
					canvas.style.width = `${containerWidth}px`;
				}
			}

			// Canvas larger than window
			if (canvas.offsetWidth > containerWidth) {
				canvas.style.height = `${containerWidth / aspectRatio}px`;
				canvas.style.width = `${containerWidth}px`;
			}

			// Window is wider than our ratio, keep the height and adjust the width
			if (canvas.offsetWidth / canvas.offsetHeight !== aspectRatio) {
				// Window too wide
				canvas.style.width = `${canvas.offsetHeight * aspectRatio}px`;
				canvas.style.height = `${canvas.offsetWidth / aspectRatio}px`;
			}
		};

		// Call once to set initial size
		resizeCanvas();

		// Attach our resize event
		window.addEventListener("resize", resizeCanvas);

		// Clean up when component unmounts
		return () => window.removeEventListener("resize", resizeCanvas);
	}, []);

	return (
		<div
			className="flex w-full flex-col justify-center items-center max-h-full h-full"
			ref={containerRef}
		>
			<div
				ref={canvasContainerRef}
				style={{
					aspectRatio: "14/10",
				}}
				className="relative bg-tuna w-full max-w-7xl rounded-lg shadow-lg overflow-auto"
			>
				{countDown > 0 && (
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl text-[#e49274] select-none">
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
