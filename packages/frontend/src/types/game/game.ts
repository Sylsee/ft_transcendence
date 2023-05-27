import { User } from "types/user/user";

export const GAME_SEND_EVENT_BASE_URL: string = "client.game.";
export const GAME_RECEIVE_EVENT_BASE_URL: string = "server.game.";

export enum GameReceiveEvent {
	Start = "start",
	Message = "message",
	Finish = "finish",
	GameCountdown = "countdown",
	GameState = "state",
	GameScore = "score",
	IsPowerUpActive = "is-power-up-active",
	PowerUpSpawn = "power-up-spawn",
	PowerUpDespawn = "power-up-despawn",
}

export enum GameSendEvent {
	MovePaddle = "move-paddle",
	PowerUp = "power-up",
}

export enum GameDirection {
	Up = "up",
	Down = "down",
	None = "none",
}

export type EmitGameSocketEvent = (
	event: GameSendEvent,
	payload: { direction: GameDirection }
) => void;

export interface PowerUpStatus {
	isActive: boolean;
}

export enum PowerUpType {
	PaddleSizeUp = "paddle-size-up",
	PaddleSizeDown = "paddle-size-down",
	BallSizeUp = "ball-size-up",
	BallSizeDown = "ball-size-down",
}

export interface PowerUpBall {
	id: string;
	radius: number;
	type: PowerUpType;
	x: number;
	y: number;
}

export interface PowerUpDespawn {
	id: string;
}

export interface GameConfig {
	player1: string;
	player2: string;
	width: number;
	height: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleSpeedPerSecond: number;
	paddleCoordinates: {
		paddle1: {
			x: number;
			y: number;
		};
		paddle2: {
			x: number;
			y: number;
		};
	};
	ballRadius: number;
	ballSpeedPerSecond: number;
	ballCoordinates: {
		x: number;
		y: number;
	};
	timeStep: number;
	maxScore: number;
}

export interface GameMovePaddleData {
	direction: GameDirection;
}

export interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	velocity: { y: number };
}

export interface Ball {
	x: number;
	y: number;
	radius: number;
	velocity: { x: number; y: number };
}

export interface GameData {
	paddle1: Paddle;
	paddle2: Paddle;
	ball: Ball;
	countDown: number;
	maxScore: number;
	width: number;
	height: number;
	score: GameScore;
	defaultCoordinates: {
		paddle1: Omit<Paddle, "velocity" | "width" | "height">;
		paddle2: Omit<Paddle, "velocity" | "width" | "height">;
		ball: Omit<Ball, "velocity" | "radius">;
	};
	isLeftPlayer: boolean;
	PowerUpBalls: PowerUpBall[];
}

export interface GameScore {
	player1Score: number;
	player2Score: number;
	winner: User | null;
}

export enum GameResult {
	Win,
	Lose,
	Equal,
}
