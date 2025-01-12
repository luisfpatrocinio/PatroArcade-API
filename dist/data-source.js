"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./database.db",
    synchronize: true,
    logging: true,
    entities: ["src/entities/*.ts"],
    migrations: [],
    subscribers: [], // Conferir
});
//# sourceMappingURL=data-source.js.map