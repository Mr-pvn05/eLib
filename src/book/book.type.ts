import { userType } from "../user/user.types.ts";

export interface Book {
  _id: string;
  title: string;
  author: userType;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
