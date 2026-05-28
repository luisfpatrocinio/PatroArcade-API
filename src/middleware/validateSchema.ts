import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const ValidateSchema =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          type: "validationError",
          content: error.issues.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return res.status(400).json({
        type: "validationError",
        content: "Erro de validação desconhecido.",
      });
    }
  };
