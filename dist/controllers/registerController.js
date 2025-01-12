"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const tslib_1 = require("tslib");
const userService_1 = require("../services/userService");
const appError_1 = tslib_1.__importDefault(require("../exceptions/appError"));
const playerService_1 = require("../services/playerService");
function registerUser(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Vai chegar um json com os dados do usuário
        console.log("Registrando usuário...");
        console.log(req.body);
        const { username, email, password, confirmPassword } = req.body;
        try {
            // Verificar se as senhas são iguais
            if (password !== confirmPassword) {
                throw new appError_1.default("As senhas não coincidem.", 400);
            }
            // Verificar se o usuário já existe
            let userExists;
            try {
                userExists = (0, userService_1.getUserDataByUserName)(username);
            }
            catch (error) {
                userExists = null;
            }
            if (userExists) {
                throw new appError_1.default("Usuário já existe.", 400);
            }
            // Verificar se o email já existe
            let emailExists;
            try {
                emailExists = (0, userService_1.getUserDataByUserName)(email);
            }
            catch (error) {
                emailExists = null;
            }
            if (emailExists) {
                throw new appError_1.default("Email já existe.", 400);
            }
            // Se tudo estiver ok, criar o usuário
            const newUser = {
                username,
                email,
                password,
            };
            // Adicionar o usuário ao banco de dados
            const newUserAdded = (0, userService_1.addUserToDatabase)(newUser);
            // Criar um jogador para o usuário
            (0, playerService_1.createPlayerForUser)(newUserAdded);
            console.log(`Usuário ${username} registrado com sucesso.`);
            res.status(200).json({ type: "registerSuccess", content: req.body });
        }
        catch (error) {
            console.log(`Erro ao registrar usuário: ${error.message}`);
            if (error instanceof appError_1.default) {
                res.status(error.statusCode).json({
                    type: "registerFailed",
                    content: error.message,
                });
            }
        }
    });
}
exports.registerUser = registerUser;
//# sourceMappingURL=registerController.js.map