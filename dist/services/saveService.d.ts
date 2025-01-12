export declare function findSaveData(playerId: number, gameId: number): import("../models/saveData").PlayerGameData;
export declare function generateNewSave(playerId: number, gameId: number): {
    playerId: number;
    gameId: number;
    data: {};
    lastPlayed: Date;
};
