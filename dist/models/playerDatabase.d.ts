export interface Player {
    id: number;
    name: string;
    level: number;
    expPoints: number;
    totalScore: number;
    bio: string;
    coins: number;
    avatarIndex: number;
    colorIndex: number;
    userId: number;
}
export declare const playerDatabase: Player[];
