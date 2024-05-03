import Banner from "@/app/(home)/components/Banner";
import BookList from "./components/BookList";

export default async function Home() {
  try {
    const response = await fetch(`${process.env.BASE_URL}/books`);
    if (!response.ok) {
      throw new Error("Error while fetching the books");
    }

    const books = await response.json();

    console.log("Books : ", books);

    return (
      <>
        <Banner />
        <BookList books={books} />
      </>
    );
  } catch (error) {
    console.error("Error fetching books:", error);
    return <div>Error fetching books. Please try again later.</div>;
  }
}
