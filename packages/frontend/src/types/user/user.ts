import { LobbyMode } from "types/game/lobby";

export interface Match {
	id: string;
	createdAt: Date;
	mode: LobbyMode;
	winner: User;
	loser: User;
	winnerPoints: number;
	loserPoints: number;
}

export interface UserStats {
	losses: number;
	wins: number;
	pointsAgainst: number;
	pointsScored: number;
	totalMatches: number;
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
