import { LobbyData, LobbyState } from "types/game/lobby";

export interface GameState {
	lobbyStatus: LobbyState;
	lobby: LobbyData | null;
	isLobbyOwner: boolean;
}
