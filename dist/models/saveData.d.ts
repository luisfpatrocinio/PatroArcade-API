export interface PlayerGameData {
    gameId: number;
    playerId: number;
    richPresenceText: string;
    lastPlayed: Date;
    data: SaveInfo;
}
type SaveInfo = {
    [key: string]: number;
};
export declare const saveDatabase: PlayerGameData[];
export {};
