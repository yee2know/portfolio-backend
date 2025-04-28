import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import adminAuth from "../middleware/adminAuth";

const prisma = new PrismaClient();
const router = Router();

// GET /posts - 글 목록 (커서 기반 페이지네이션)
router.get("/", async (req, res) => {
  const { cursor, limit = 10, search = "", category, tag } = req.query;
  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search as string } },
      { content: { contains: search as string } },
    ];
  }
  if (category) where.categoryId = Number(category);
  if (tag) where.tags = { some: { tagId: Number(tag) } };
  const take = Number(limit);
  const findManyArgs: any = {
    where,
    take: take + 1, // 다음 페이지 유무 확인용
    orderBy: { createdAt: "desc" },
    include: { category: true, tags: { include: { tag: true } }, images: true },
  };
  if (cursor) {
    findManyArgs.skip = 1;
    findManyArgs.cursor = { id: Number(cursor) };
  }
  const posts = await prisma.post.findMany(findManyArgs);
  let nextCursor = null;
  if (posts.length > take) {
    nextCursor = String(posts[take].id); // Always return as string
    posts.pop();
  }
  res.json({ posts, nextCursor });
});

// GET /posts/:id - 글 상세
router.get("/:id", async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true, tags: { include: { tag: true } }, images: true, comments: true },
  });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

// POST /posts - 글 작성 (관리자)
router.post("/", adminAuth, async (req, res) => {
  const { title, content, categoryId, tagIds = [], imageUrls = [] } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      categoryId,
      tags: { create: tagIds.map((tagId: number) => ({ tagId })) },
      images: { create: imageUrls.map((url: string) => ({ url })) },
    },
    include: { category: true, tags: { include: { tag: true } }, images: true },
  });
  res.status(201).json(post);
});

// PUT /posts/:id - 글 수정 (관리자)
router.put("/:id", adminAuth, async (req, res) => {
  const { title, content, categoryId, tagIds = [], imageUrls = [] } = req.body;
  const post = await prisma.post.update({
    where: { id: Number(req.params.id) },
    data: {
      title,
      content,
      categoryId,
      tags: { deleteMany: {}, create: tagIds.map((tagId: number) => ({ tagId })) },
      images: { deleteMany: {}, create: imageUrls.map((url: string) => ({ url })) },
    },
    include: { category: true, tags: { include: { tag: true } }, images: true },
  });
  res.json(post);
});

// DELETE /posts/:id - 글 삭제 (관리자)
router.delete("/:id", adminAuth, async (req, res) => {
  await prisma.post.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
