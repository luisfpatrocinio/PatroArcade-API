import { Request, Response } from "express";
import { usersDatabase } from "../models/userModel";

export const getAllUsers = (req: Request, res: Response) => {
  console.log("Obtendo todos os usuários.");
  return res.status(200).json({ type: "allUsers", content: usersDatabase });
};
