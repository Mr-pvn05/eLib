import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./book.model.ts";
import fs from "node:fs";
import { AuthRequest } from "../middleware/authenticate.ts";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Uploading cover image
    console.log("Files : ", files);

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const filename = files.coverImage[0].filename;

    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    const uploadCoverImage = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // Uploading Book File
    const bookFileMimeType = files.file[0].mimetype.split("/").at(-1);

    const bookFilename = files.file[0].filename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFilename
    );
    const uploadBookFile = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFilename,
      folder: "book-files",
      format: bookFileMimeType,
    });

    // Save book to database

    const { title, genre, description } = req.body;

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      author: _req.userId,
      description,
      genre,
      coverImage: uploadCoverImage.secure_url,
      file: uploadBookFile.secure_url,
    });

    console.log("Response : ", newBook);

    // delete temp files
    try {
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      console.log("Error in deleting file : ", error);
    }

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.log("Error in uploading book pdf : ", error);
    return next(createHttpError(500, "Error while uploading files"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }

  // Check acess
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(
      createHttpError(403, "You don't have access to update this book!")
    );
  }

  // Check if image feild is exists
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  let completeCoverImage = "";
  if (files.coverImage) {
    // Uploading cover image
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const filename = files.coverImage[0].filename;

    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );

    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // Check if files feild exists
  let completeFileName = "";
  if (files.file) {
    const bookFileMimeType = files.file[0].mimetype.split("/").at(-1);

    const bookFilename = files.file[0].filename;

    completeFileName = bookFilename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFilename
    );

    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-files",
      format: bookFileMimeType,
    });

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updatedBook);
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find().populate("author", "name");
    res.json(books);
  } catch (error) {
    return next(createHttpError(500, "Error while getting books"));
  }
};

const getBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel
      .findOne({ _id: bookId })
      .populate("author", "name");
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }
    return res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.id;
  const book = await bookModel.findOne({ _id: bookId });

  if (!book) return next(createHttpError(404, "Book not found"));

  // check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "You can not delete this book!"));
  }

  const coverImageSplit = book.coverImage?.split("/");

  const coverImagePublicId =
    coverImageSplit?.at(-2) + "/" + coverImageSplit.at(-1)?.split(".").at(-2);

  const bookFileSplit = book.file.split("/");
  const bookFilePublicId = bookFileSplit?.at(-2) + "/" + bookFileSplit.at(-1);

  try {
    await cloudinary.uploader.destroy(coverImagePublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });
  } catch (error) {
    return next(
      createHttpError(500, "Error while deleting book cover and book file")
    );
  }
  await bookModel.deleteOne({ _id: bookId });

  return res.sendStatus(204);
};

export { createBook, updateBook, listBooks, getBook, deleteBook };
