export interface GameInfo {
    id: number;
    title: string;
    description: string;
    genre: string;
    tags: string[];
    dataLabels: {};
}
export declare const gameDatabase: GameInfo[];
