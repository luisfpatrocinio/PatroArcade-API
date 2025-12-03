import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getPlayerByUserId } from "../services/playerService";

const router = Router();

// Inicia o login com Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// O Google devolve o usuário para cá
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    async (req, res) => {
        const user = req.user as any;

        try {
            const player = await getPlayerByUserId(user.id);

            // Gera o mesmo Token que você usa no login normal
            const payload = {
                userId: user.id,
                username: user.username,
                role: user.role,
                playerId: player.id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                expiresIn: "8h",
            });

            // Redireciona para o WebServer com o token na URL
            // ATENÇÃO: Trocar pelo link de produção se estiver deployando
            const webServerUrl = process.env.PAGEURL || "http://localhost:3001";

            // Enviamos o token e o playerId para o front salvar
            res.redirect(`${webServerUrl}/login/callback?token=${token}&playerId=${player.id}`);

        } catch (error) {
            console.error(error);
            res.redirect("/login?error=auth_failed");
        }
    }
);

export { router as authRoutes };