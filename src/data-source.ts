import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Player } from "./entities/Player";
import { Game } from "./entities/Game";
import { SaveData } from "./entities/SaveData";
import { Arcade } from "./entities/Arcade";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.db",
  synchronize: true,
  logging: true, // True por enquanto para debug
  entities: [User, Player, Game, SaveData, Arcade],
  migrations: [],
  subscribers: [],
});
