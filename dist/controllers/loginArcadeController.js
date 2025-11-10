"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoginPage = exports.tryToLoginArcade = void 0;
const tslib_1 = require("tslib");
const userService_1 = require("../services/userService");
const arcadeService_1 = require("../services/arcadeService");
const loginExceptions_1 = require("../exceptions/loginExceptions");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const pageUrl = process.env.PAGEURL || "http://localhost:5999";
function tryToLoginArcade(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Analisa credenciais recebidas.
        const clientTempId = req.params.clientTempId;
        const { username, password } = req.body;
        console.log(`[ADMIN LOGIN ATTEMPT]: Temp ID: ${clientTempId} \n${username} : ${password}.`);
        try {
            // Verifica se as credenciais são válidas.
            if (yield (0, userService_1.checkCredentials)(username, password)) {
                // Credenciais válidas. Checando se é um admin.
                const user = (0, userService_1.getUserDataByUserName)(username);
                if (user.role !== "admin") {
                    throw loginExceptions_1.UserIsNotAdminException;
                }
                // Se as credenciais forem válidas, retorna sucesso.
                res.status(200);
                res.json({
                    type: "loginSuccess",
                    content: {
                        username: username,
                        role: "admin",
                        clientTempId: clientTempId,
                    },
                });
                // Atualiza o identificador do fliperama.
                const id = user.arcades[0]; // TODO: Tratamento para quando o usuário tiver mais de um fliperama. (arcades.length > 1)
                (0, arcadeService_1.updateArcadeIdentifier)(id, clientTempId);
            }
            else {
                // Se as credenciais não forem válidas, retorna erro.
                res.status(401).json({
                    type: "arcadeLoginError",
                    content: "Credenciais inválidas.",
                });
            }
        }
        catch (error) {
            res.status(error.statusCode);
            res.json({
                type: "arcadeLoginError",
                content: error.message,
            });
        }
    });
}
exports.tryToLoginArcade = tryToLoginArcade;
function generateLoginPage(req, res) {
    const clientId = parseInt(req.params.clientId);
    console.log(`Redirecionando para ${pageUrl}/login/${clientId}`);
    res.redirect(`${pageUrl}/login/${clientId}`);
}
exports.generateLoginPage = generateLoginPage;
//# sourceMappingURL=loginArcadeController.js.map