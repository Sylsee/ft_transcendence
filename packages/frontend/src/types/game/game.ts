export const GAME_SEND_EVENT_BASE_URL: string = "server.game.";
export const GAME_RECEIVE_EVENT_BASE_URL: string = "server.game.";

export enum GameReceiveEvent {
	Start = "start",
	Message = "message",
	Finish = "finish",
}

export enum GameSendEvent {}
