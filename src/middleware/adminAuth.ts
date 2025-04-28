import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "changeme";

export default function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = auth.split(" ")[1];
  try {
    jwt.verify(token, ADMIN_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
}
