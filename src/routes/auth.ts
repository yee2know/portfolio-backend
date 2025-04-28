import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const ADMIN_SECRET = process.env.ADMIN_SECRET || "changeme";

// POST /auth/login - 관리자 로그인(토큰 발급)
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });
  if (password !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ admin: true }, ADMIN_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

export default router;
