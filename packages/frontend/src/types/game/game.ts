export const GAME_SEND_EVENT_BASE_URL: string = "client.game.";
export const GAME_RECEIVE_EVENT_BASE_URL: string = "server.game.";

export enum GameReceiveEvent {
	Start = "start",
	Message = "message",
	Finish = "finish",
	GameCountdown = "countdown",
	GameState = "state",
	GameScore = "score",
}

export enum GameSendEvent {
	MovePaddle = "move-paddle",
}

export enum GameDirection {
	Up = "up",
	Down = "down",
	None = "none",
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
}
