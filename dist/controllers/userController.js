"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const userModel_1 = require("../models/userModel");
const getAllUsers = (req, res) => {
    console.log("Obtendo todos os usuários.");
    return res.status(200).json({ type: "allUsers", content: userModel_1.usersDatabase });
};
exports.getAllUsers = getAllUsers;
