export interface ArcadeInfo {
    id: number;
    name: string;
    description: string;
}
export declare const arcadeDatabase: ArcadeInfo[];
export declare function createArcade(arcade: ArcadeInfo): void;
