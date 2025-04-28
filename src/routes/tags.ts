import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import adminAuth from "../middleware/adminAuth";

const prisma = new PrismaClient();
const router = Router();

// GET /tags - 태그 목록
router.get("/", async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.json(tags);
});

// POST /tags - 태그 추가 (관리자)
router.post("/", adminAuth, async (req, res) => {
  const { name } = req.body;
  const tag = await prisma.tag.create({ data: { name } });
  res.status(201).json(tag);
});

export default router;
