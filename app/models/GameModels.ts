export interface GameDTO {
	gameId: number;
	liveId?: string;
	gameTime: GameTime;
	homeTeam: Team;
	awayTeam: Team;
}

export interface GameTime {
	gameStatus: GameStatus;
	gameStatusText: string;
	period?: number;
	gameClock?: string;
	gameTimeUTC: Date;
	gameDate: string;
}

interface Team {
	teamId: number;
	teamName: string;
	score?: number;
}

export enum GameStatus {
	Before = 1,
	During = 2,
	Final = 3,
}
