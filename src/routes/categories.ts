import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import adminAuth from "../middleware/adminAuth";

const prisma = new PrismaClient();
const router = Router();

// GET /categories - 카테고리 목록
router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// POST /categories - 카테고리 추가 (관리자)
router.post("/", adminAuth, async (req, res) => {
  const { name } = req.body;
  const category = await prisma.category.create({ data: { name } });
  res.status(201).json(category);
});

export default router;
