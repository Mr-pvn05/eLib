import express from "express";
import { createBook } from "./book.controller";
import path from "node:path";
import multer from "multer";

const router = express.Router();

console.log(path.resolve(__dirname));

// file store local ->
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 300mb
});

router.post(
  "/create",
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "file",
      maxCount: 1,
    },
  ]),
  createBook
);

export default router;
