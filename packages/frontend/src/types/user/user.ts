export interface UserStats {
	wins: number;
	losses: number;
}

export interface Match {
	id: string;
	players: User[];
	winner: User;
	date: Date;
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
