import { PlayerGameData } from "./saveData";
export interface Player {
  id: number;
  name: string;
  level: number;
  expPoints: number;
  totalScore: number;
  bio: string;
  coins: number;
  avatarIndex: number;
  colorIndex: number;
  userId: number;
}

export const playerDatabase: Player[] = [
  {
    id: 1,
    name: "Patrocinio",
    level: 1,
    expPoints: 69,
    totalScore: 0,
    bio: "Mestre do Universo",
    coins: 0,
    avatarIndex: 1,
    colorIndex: 1,
    userId: 1,
  },
  {
    id: 2,
    name: "Goku",
    level: 2,
    expPoints: 150,
    totalScore: 300,
    bio: "O Saiyajin mais forte do universo",
    coins: 50,
    avatarIndex: 2,
    colorIndex: 2,
    userId: 2,
  },
  {
    id: 3,
    name: "Luffy",
    level: 3,
    expPoints: 300,
    totalScore: 600,
    bio: "O futuro Rei dos Piratas",
    coins: 100,
    avatarIndex: 3,
    colorIndex: 3,
    userId: 3,
  },
  {
    id: 4,
    name: "Ichigo Kurosaki",
    level: 4,
    expPoints: 450,
    totalScore: 900,
    bio: "O Shinigami substituto",
    coins: 150,
    avatarIndex: 4,
    colorIndex: 4,
    userId: 4,
  },
  {
    id: 5,
    name: "Saitama",
    level: 5,
    expPoints: 600,
    totalScore: 1200,
    bio: "O herói por hobby",
    coins: 200,
    avatarIndex: 5,
    colorIndex: 5,
    userId: 5,
  },
];
