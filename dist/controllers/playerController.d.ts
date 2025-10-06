import { Request, Response } from "express";
export declare const getMyPlayerData: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const getPlayerData: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const createNewPlayer: (req: Request, res: Response) => void;
export declare const getPlayerAllSaves: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const getAllPlayersData: (req: Request, res: Response) => Response<any, Record<string, any>>;
