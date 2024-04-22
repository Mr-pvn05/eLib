import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./user.model.ts";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config.ts";
import { userType } from "./user.types.ts";
import { access } from "fs";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }

    // Check if user already exists
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User already exists with this email");
      next(error);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // User save to the Database
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    //JOSN web token
    const token = sign({ sub: newUser._id }, config.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({ acessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(createHttpError(400, "Please provide email and password"));

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) return next(createHttpError(400, "User not found"));

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) return next(createHttpError(400, "Invalid password"));

    // Create and assign a token
    const token = sign({ sub: user._id }, config.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }
};

export { createUser, login };
