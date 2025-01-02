export interface GameInfo {
  id: number;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  dataLabels: {};
}

export const gameDatabase: GameInfo[] = [
  {
    id: 1,
    title: "Space Squadron",
    description: "A thrilling space shooter game where you destroy asteroids.",
    genre: "Arcade",
    tags: ["space", "shooter", "arcade"],
    dataLabels: {
      highestScore: "Pontuação Máxima",
      totalScore: "Pontuação Total",
      asteroidsDestroyed: "Asteroides Destruidos",
      coinsCollected: "Moedas Coletadas",
    },
  },
  {
    id: 2,
    title: "PatroWarriors",
    description:
      "An action-packed game where you defeat enemies and reach new levels.",
    genre: "Action",
    tags: ["action", "adventure", "warrior"],
    dataLabels: {
      highestScore: "Pontuação Máxima",
      totalScore: "Pontuação Total",
      levelsCompleted: "Níveis Completados",
      enemiesDefeated: "Inimigos Derrotados",
      coinsCollected: "Moedas Coletadas",
    },
  },
];
