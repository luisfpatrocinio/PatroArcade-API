import { Request, Response } from "express";
export declare function getPlayerSaveData(req: Request, res: Response): Response<any, Record<string, any>>;
export declare function getSaveDatas(req: Request, res: Response): Response<any, Record<string, any>>;
export declare function savePlayerData(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateRichPresence(req: Request, res: Response): Response<any, Record<string, any>>;
