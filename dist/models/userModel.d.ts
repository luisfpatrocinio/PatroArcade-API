export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: "admin" | "player";
}
export interface AdminUser extends User {
    role: "admin";
    arcades: number[];
}
export declare const usersDatabase: (User | AdminUser)[];
