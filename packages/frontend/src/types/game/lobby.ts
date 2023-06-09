import { User } from "types/user/user";

export enum LobbyState {
	Idle,
	Searching,
	Found,
	Countdown,
	Start,
	Finish,
}

export enum LobbyMode {
	QuickPlay = "quick-play",
	Custom = "custom",
}

export type LobbyUser = Omit<User, "status"> & { isReady: boolean };

export interface LobbyData {
	lobbyId: string;
	mode: LobbyMode;
	isPowerUpEnabled: boolean;
	hasFinished: false;
	hasStarted: false;
	players: LobbyUser[];
}

export const LOBBY_SEND_EVENT_BASE_URL: string = "client.lobby.";
export const LOBBY_RECEIVE_EVENT_BASE_URL: string = "server.lobby.";

export enum LobbyReceiveEvent {
	State = "state",
	Invite = "invite", // it's a chat event but it's related to lobby
}

export enum LobbySendEvent {
	Search = "search",
	CancelSearchGame = "cancel-search",
	CreateLobby = "create",
	JoinLobby = "join",
	LeaveLobby = "leave",
	Ready = "ready",
	Unready = "unready",
	InviteToLobby = "invite",
}
