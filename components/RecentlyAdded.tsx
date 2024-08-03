import { getRecentlyAddedBooks } from "@/lib/actions";
import BookCover from "./BookCover";
import { BookDocument } from "@/lib/constants";

const RecentlyAdded = async () => {
  const books: BookDocument[] = await getRecentlyAddedBooks();
  return (
    <section>
      <h1 className="font-semibold text-xl mb-5">Recently Added Books</h1>
      <div className="flex flex-row gap-10">
        {books.map((book) => {
          return (
            <div className="w-[165px] h-[250px]" key={String(book._id)}>
              <BookCover
                imageUrl={book.imageUrl}
                title={book.title}
                author={book.author}
                year={book.publishYear}
                bookId={String(book._id)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyAdded;
