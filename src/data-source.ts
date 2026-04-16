import { DataSource, DataSourceOptions } from "typeorm";
import "dotenv/config";

import { User } from "./entities/User";
import { Player } from "./entities/Player";
import { Game } from "./entities/Game";
import { Score } from "./entities/Score";
import { Arcade } from "./entities/Arcade";

const isPostgres = process.env.DB_TYPE === "postgres";

const postgresConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // Em PRD ideal é false
  logging: false,
  entities: [User, Player, Game, Score, Arcade],
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
};

const sqliteConfig: DataSourceOptions = {
  type: "sqlite",
  database: "database.db",
  synchronize: true,
  logging: false,
  entities: [User, Player, Game, Score, Arcade],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(
  isPostgres ? postgresConfig : sqliteConfig
);
