import { Player } from "./Player";
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: "admin" | "player";
    arcades: number[] | null;
    player: Player;
}
