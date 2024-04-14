import { Request, Response } from "express";

const createUser = async (req: Request, res: Response) => {
  try {
    res.json({ message: "User created" });
  } catch (error) {
    console.log(error);
  }
};

export { createUser };
