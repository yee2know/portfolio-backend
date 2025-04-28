import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import adminAuth from "../middleware/adminAuth";

const prisma = new PrismaClient();
const router = Router();

// GET /comments?postId= - 특정 글의 댓글 목록
router.get("/", async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ error: "postId required" });
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    orderBy: { createdAt: "asc" },
  });
  res.json(comments);
});

// POST /comments - 댓글 추가
router.post("/", async (req, res) => {
  const { postId, content } = req.body;
  if (!postId || !content) return res.status(400).json({ error: "postId and content required" });
  const comment = await prisma.comment.create({ data: { postId, content } });
  res.status(201).json(comment);
});

// DELETE /comments/:id - 댓글 삭제 (관리자)
router.delete("/:id", adminAuth, async (req, res) => {
  await prisma.comment.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
