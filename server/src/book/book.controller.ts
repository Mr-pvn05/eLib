import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./book.model.ts";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Uploading cover image
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

    console.log("Upload cover image : ", uploadCoverImage);
    console.log("Upload book file : ", uploadBookFile);

    // Save book to database

    const { title, author, genre } = req.body;

    const newBook = await bookModel.create({
      title,
      author: "66227b46dc6f95fc88525023",
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

export { createBook };
