import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedJwtPayload extends JwtPayload {
    userId: number;
    username: string;
    role: string;
}

// Extend Express Request to include 'user' property with JWT payload
declare global {
    namespace Express {
        interface Request {
            user?: DecodedJwtPayload;
        }
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
            content: "Authentication token missing or invalid.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedPayload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as DecodedJwtPayload;

        req.user = decodedPayload;

        next();
    } catch (error) {
        return res.status(403).json({
            type: "forbidden",
            content:
                "Authentication token invalid or expired. Please log in again.",
        });
    }
};
