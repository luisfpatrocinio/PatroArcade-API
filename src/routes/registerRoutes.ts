import { Router } from "express";
import { registerUser } from "../controllers/registerController";
import { body } from "express-validator";

// Criar uma instância do Router
const router = Router();

// Adicionar o array de validações como middleware
router.post(
  "/",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Usuário precisa ter no mínimo 3 caracteres.")
      .trim()
      .escape(),
    body("email").isEmail().withMessage("Email inválido.").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha precisa ter no mínimo 6 caracteres."),
  ],
  registerUser // O controller só roda se a validação passar
);

export { router as registerRoutes };
