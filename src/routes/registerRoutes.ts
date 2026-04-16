import { Router } from "express";
import { RegisterUser } from "../controllers/registerController";
import { ValidateSchema } from "../middleware/validateSchema";
import { RegisterSchema } from "../validators/authValidator";

// Criar uma instância do Router
const router = Router();

// Adicionar o array de validações como middleware
router.post(
  "/",
  ValidateSchema(RegisterSchema),
  RegisterUser // O controller só roda se a validação passar
);

export { router as registerRoutes };
