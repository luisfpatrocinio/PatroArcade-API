import { DataSource } from "typeorm";
import "dotenv/config";

import { User } from "./entities/User";
import { Player } from "./entities/Player";
import { Game } from "./entities/Game";
import { SaveData } from "./entities/SaveData";
import { Arcade } from "./entities/Arcade";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Player, Game, SaveData, Arcade],
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
});
