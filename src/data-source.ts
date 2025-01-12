import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.db",
  synchronize: true,
  logging: true,
  entities: ["src/entities/*.ts"],
  migrations: [], // Conferir
  subscribers: [], // Conferir
});
