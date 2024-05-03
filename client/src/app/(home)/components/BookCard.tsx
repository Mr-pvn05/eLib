import { Book } from "@/types";
import Image from "next/image";
import React from "react";
import Link from "next/link";
const BookCard = ({ book }: { book: Book }) => {
  return (
    <div className="flex gap-5 border p-5 shadow-md rounded">
      <Image
        src={book.coverImage}
        alt={book.title}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "auto", height: "12rem" }}
      />
      <div>
        <h2 className="line-clamp-2 text-xl font-bold text-primary-600 text-balance">
          {book.title}
        </h2>
        <p className="font-bold text-primary-900 mt-1">{book.author.name}</p>
        <Link
          className="border border-primary-500 inline-block hover:bg-primary-100 hover:border-primary-100 text-primary-500 mt-4 font-medium text-sm py-1 px-2 rounded transition"
          href={`/book/${book._id}`}
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
