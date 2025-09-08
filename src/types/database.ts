export interface Footballer {
    id: number;
    fullname: string;
    avatar: string;
    position: string;
    nationality: string;
    club: string;
    league: string;
    rating: number;
    birthdate: Date;
    shield: string;
}

export interface DailyChallenge {
    mode_id: number;
    footballer_id: number;
}