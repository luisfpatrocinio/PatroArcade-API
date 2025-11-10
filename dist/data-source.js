"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Player_1 = require("./entities/Player");
const Game_1 = require("./entities/Game");
const SaveData_1 = require("./entities/SaveData");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./database.db",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Player_1.Player, Game_1.Game, SaveData_1.SaveData],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map