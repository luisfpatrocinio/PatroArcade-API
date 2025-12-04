// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// 1. Adicione 'playerId' à interface
interface DecodedJwtPayload extends JwtPayload {
  userId: number;
  playerId: number; // <- ADICIONADO
  username: string;
  role: string;
}

// Extend Express Request to include 'user' property with JWT payload
declare global {
  namespace Express {
    interface User extends DecodedJwtPayload { }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      type: "unauthorized",
      content: "Token de autenticação ausente ou inválido.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedJwtPayload;

    // 2. Validação extra: garantir que os campos esperados estão no token
    if (!decodedPayload.userId || !decodedPayload.playerId || !decodedPayload.role) {
      return res.status(403).json({
        type: "forbidden",
        content: "Token inválido (malformado). Por favor, faça login novamente.",
      });
    }

    // 3. Adiciona o payload decodificado (com userId, playerId, role) ao req.user
    req.user = decodedPayload;

    next(); // Próximo!
  } catch (error) {
    return res.status(403).json({
      type: "forbidden",
      content:
        "Token de autenticação inválido ou expirado. Por favor, faça login novamente.",
    });
  }
};