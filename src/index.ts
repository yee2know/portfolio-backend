import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import postsRouter from "./routes/posts";
import categoriesRouter from "./routes/categories";
import tagsRouter from "./routes/tags";
import commentsRouter from "./routes/comments";
import imagesRouter from "./routes/images";
import authRouter from "./routes/auth";

// 환경변수 로드
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // 이미지 서빙

// 라우터 등록
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/categories", categoriesRouter);
app.use("/tags", tagsRouter);
app.use("/comments", commentsRouter);
app.use("/images", imagesRouter);

// 기본 헬스체크
app.get("/", (req, res) => {
  res.send("Blog backend is running!");
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Blog backend running on port ${port}`);
});
