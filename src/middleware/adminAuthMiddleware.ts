import { Request, Response, NextFunction } from "express";

/**
 * Middleware de Autorização: Verifica se o usuário autenticado tem a função de 'admin'.
 *
 * IMPORTANTE: Este middleware DEVE ser executado depois do 'authMiddleware',
 * pois ele depende do objeto 'req.user' que é adicionado por lá.
 */
export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    "[adminAuthMiddleware] VERIFICANDO PERMISSÕES PARA O USUÁRIO:",
    req.user
  );

  // 1. Acessamos o objeto `req.user` que foi decodificado do token JWT.
  //    A `role` foi incluída no token durante o login.
  //    Usamos `(req.user as any)` como uma forma de dizer ao TypeScript:
  //    "Confie em mim, eu sei que a propriedade 'role' existe aqui".
  const userRole = (req.user as any)?.role;

  // 2. Verificamos se a 'role' do usuário não é 'admin'.
  if (userRole !== "admin") {
    // 3. Se não for 'admin', bloqueamos a requisição com um status 403 Forbidden.
    return res.status(403).json({
      type: "error",
      content:
        "Acesso proibido. Esta ação requer privilégios de administrador.",
    });
  }

  // 4. Se o usuário for 'admin', a verificação passa.
  next();
};
