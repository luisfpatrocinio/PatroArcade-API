import { User, AdminUser } from "../models/userModel";
export declare function checkCredentials(username: string, passwordFromReq: string): Promise<boolean>;
export declare function getUserDataByUserName(username: string): User | AdminUser;
export declare function getUserDataByEmail(email: string): User | AdminUser;
export declare function addUserToDatabase(user: Partial<User>): User;
export declare function isAlreadyConnected(userId: number): boolean;
export declare function isClientFull(clientId: number): boolean;
export declare function userHasPlayer(userId: number): boolean;
