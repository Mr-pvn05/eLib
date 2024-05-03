export interface Book {
  _id: string;
  title: string;
  genre: string;
  author: Author;
  coverImage: string;
  file: string;
}

export type Author = {
  name: string;
};
