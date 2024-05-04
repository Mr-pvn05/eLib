import React from "react";
import { Book } from "@/types";
import BookCard from "./BookCard";

const BookList = async () => {
  const response = await fetch(`${process.env.BASE_URL}/books`);
  if (!response.ok) {
    throw new Error("Error while fetching the books");
  }

  const books = await response.json();
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 container mb-10 mx-auto">
      {books.map((book: Book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
