import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedJwtPayload extends JwtPayload {
  userId: number;
  username: string;
  role: string;
}

// Extende o tipo Request do Express para incluir a propriedade 'user'.
// Isso permite que o TypeScript reconheça 'req.user' como parte do objeto Request,
// facilitando o acesso aos dados do usuário autenticado em qualquer rota protegida.
// A interface DecodedJwtPayload define os campos esperados no payload do JWT.
declare global {
    namespace Express {
        interface Request {
            user?: DecodedJwtPayload; // Propriedade opcional que armazena os dados do usuário autenticado
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. Obter o cabeçalho 'authorization' da requisição
    const authHeader = req.headers['authorization'];

    // 2. Verificar se o cabeçalho existe e está no formato correto: 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ type: 'unauthorized', content: 'Token de autenticação ausente ou inválido.' });
    }

    // 3. Extrair apenas o token do cabeçalho (removendo o "Bearer ")
    const token = authHeader.split(' ')[1];

    // Bloco try...catch para lidar com tokens inválidos (expirados, assinatura incorreta, etc.)
    try {
        // 4. Verificar o token
        // A função 'jwt.verify' faz todo o trabalho pesado:
        // - decodifica o token
        // - verifica se a assinatura corresponde à sua JWT_SECRET
        // - verifica se o token não expirou
        // Se algo estiver errado, ela lançará um erro, que será capturado pelo 'catch'
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedJwtPayload;

        // 5. Se o token for válido, adicionamos o payload decodificado (com os dados do usuário) ao objeto 'req'.
        // Isso torna os dados do usuário autenticado acessíveis em qualquer rota protegida por este middleware.
        req.user = decodedPayload;

        // 6. Chamar 'next()' para passar a requisição para o próximo handler (controller da rota).
        next();
    
    } catch (error) {
        return res.status(403).json( {
            type: 'forbidden',
            content: 'Token de autenticação inválido ou expirado. Por favor, faça login novamente.'
        })
    }
}
