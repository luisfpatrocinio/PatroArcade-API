import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { createPlayerForUser } from "./playerService";
import dotenv from "dotenv";

dotenv.config();

// Define a URL base da API.
const apiUrl = process.env.API_URL || "http://localhost:3001";

const userRepository = AppDataSource.getRepository(User);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: `${apiUrl}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Verifica se usuário já existe pelo Google ID
                let user = await userRepository.findOneBy({ googleId: profile.id });

                if (!user) {
                    // 2. Se não, tenta achar pelo email para vincular contas
                    const email = profile.emails?.[0].value;
                    if (email) {
                        user = await userRepository.findOneBy({ email });
                        if (user) {
                            user.googleId = profile.id; // Vincula a conta existente
                            await userRepository.save(user);
                        }
                    }
                }

                // 3. Se ainda não existe, cria um novo
                if (!user) {
                    const newUser = new User();
                    // Cria um username único baseado no nome do Google
                    newUser.username = (profile.displayName || "User").replace(/\s/g, "") + Math.floor(Math.random() * 10000);
                    newUser.email = profile.emails?.[0].value || "";
                    newUser.googleId = profile.id;
                    newUser.role = "player";
                    newUser.password = ""; // Sem senha

                    user = await userRepository.save(newUser);
                    await createPlayerForUser(user); // Cria o perfil de jogador
                }

                return done(null, user as any);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);