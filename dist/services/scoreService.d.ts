import { Player } from "../models/playerDatabase";
export declare function getPlayerDataByName(playerName: string): Player | undefined;
export declare function getPlayerDataById(userId: number): Player | undefined;
export declare function updatePlayerScore(playerId: number, score: number): void;
