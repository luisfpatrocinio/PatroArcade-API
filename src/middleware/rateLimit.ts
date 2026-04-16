import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limitar a 100 requisições por IP a cada 15 minutos
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    statusCode: 429, // Explicitly define Status HTTP 429
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            type: "tooManyRequests",
            content: "Muitas requisições do mesmo IP. Tente novamente mais tarde.",
        });
    }
});

export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Limite estrito de 5 tentativas por minuto para rotas de autenticação (mitigação brute force)
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429, // Status 429
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            type: "tooManyRequests",
            content: "Muitas tentativas na rota de autenticação. Aguarde antes de tentar novamente.",
        });
    }
});
