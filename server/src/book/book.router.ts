import express from "express";
import {
  createBook,
  listBooks,
  updateBook,
  getBook,
  deleteBook,
} from "./book.controller.ts";
import path from "node:path";
import authenticate from "../middleware/authenticate.ts";
import multer from "multer";

const router = express.Router();

// file store local ->
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 300mb
});

router.post(
  "/create",
  authenticate,
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
router.patch(
  "/:bookId",
  authenticate,
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
  updateBook
);
router.get("/", listBooks);
router.get("/:bookId", getBook);
router.delete("/:id", authenticate, deleteBook);

export default router;
