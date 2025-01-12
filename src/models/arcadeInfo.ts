export interface ArcadeInfo {
  id: number;
  name: string;
  description: string;
}

export const arcadeDatabase: ArcadeInfo[] = [
  {
    id: 44,
    name: "Arcade Primeiro",
    description: "O primeiro arcade do sistema.",
  },
];

export function createArcade(arcade: ArcadeInfo): void {
  arcadeDatabase.push(arcade);
}
