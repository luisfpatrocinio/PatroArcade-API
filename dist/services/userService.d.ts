import { User } from "../models/userModel";
export declare function checkCredentials(username: string, password: string): boolean;
export declare function getUserDataByUserName(username: string): User;
export declare function getUserDataByEmail(email: string): User;
export declare function addUserToDatabase(user: Partial<User>): User;
export declare function isAlreadyConnected(userId: number): boolean;
export declare function isClientFull(clientId: number): boolean;
export declare function userHasPlayer(userId: number): boolean;
