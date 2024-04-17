import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./user.model.ts";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config.ts";
import { userType } from "./user.types.ts";

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
    console.log(error);
  }
};

export { createUser };
