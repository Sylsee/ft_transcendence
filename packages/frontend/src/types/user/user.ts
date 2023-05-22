import { LobbyMode } from "types/game/lobby";

export interface UserStats {
	wins: number;
	losses: number;
}

export interface Match {
	id: string;
	createdAt: Date;
	mode: LobbyMode;
	winner: User;
	loser: User;
	winnerPoints: number;
	loserPoints: number;
}

// user
export enum UserStatus {
	Online = "online",
	InGame = "inGame",
	Offline = "offline",
}

export interface User {
	id: string;
	name: string;
	profilePictureUrl: string;
	status?: UserStatus;
}
