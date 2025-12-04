import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getPlayerByUserId } from "../services/playerService";
import { connectPlayer } from "../app"; // Importar função de conexão do app
import { addPlayerToClient, sendWebSocketMessage } from "../services/clientService"; // Importar serviços de socket

const router = Router();

// 1. Rota de Início: Captura o clientId da URL e passa para o 'state' do Google
router.get("/google", (req, res, next) => {
    // Pega o clientId que o WebServer enviou (ex: ?clientId=1)
    const clientId = req.query.clientId as string;

    // Passamos o clientId dentro da opção 'state'.
    // O Google vai devolver esse valor intacto no callback.
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: clientId ? clientId : undefined
    })(req, res, next);
});

// 2. Rota de Callback: Recebe o usuário E o clientId (no state)
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    async (req, res) => {
        const user = req.user as any;

        // O 'state' devolvido pelo Google contém o nosso clientId
        const clientIdString = req.query.state as string;

        try {
            const player = await getPlayerByUserId(user.id);

            const payload = {
                userId: user.id,
                username: user.username,
                role: user.role,
                playerId: player.id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                expiresIn: "8h",
            });

            // --- LÓGICA DE WEBSOCKET (Igual ao loginController) ---
            if (clientIdString) {
                const clientId = parseInt(clientIdString);

                if (!isNaN(clientId)) {
                    try {
                        console.log(`[Google Auth] Tentando conectar Player ${user.username} ao Cliente ${clientId}...`);

                        // 1. Conecta logicamente
                        connectPlayer(user.id, clientId);

                        // 2. Adiciona à lista do cliente
                        addPlayerToClient(clientId, user.id);

                        // 3. Prepara payload para o jogo (Godot)
                        const loginContent = {
                            player: player,
                            token: token,
                        };

                        // 4. Envia mensagem via WebSocket para o jogo
                        sendWebSocketMessage(clientId, "playerJoined", loginContent);

                        console.log(`[Google Auth] Sucesso! Player enviado para o jogo.`);
                    } catch (wsError) {
                        // Se o jogo não estiver conectado ou der erro (ex: sala cheia),
                        // apenas logamos o erro, mas NÃO impedimos o login no site.
                        console.warn(`[Google Auth Aviso] Login realizado, mas falha ao conectar no Arcade:`, wsError);
                    }
                }
            }
            // -----------------------------------------------------

            const webServerUrl = process.env.PAGEURL || "http://localhost:3000";
            res.redirect(`${webServerUrl}/login/callback?token=${token}&playerId=${player.id}`);

        } catch (error) {
            console.error(error);
            const webServerUrl = process.env.PAGEURL || "http://localhost:3000";
            res.redirect(`${webServerUrl}/login?error=auth_failed`);
        }
    }
);

export { router as authRoutes };