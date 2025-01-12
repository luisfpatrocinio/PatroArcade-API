import { Application } from "express";
declare const app: Application;
export declare function connectPlayer(userId: number, clientId: number): void;
export declare function disconnectPlayer(playerId: number): void;
export declare function getConnectedPlayerId(): string | null;
export default app;
