import { db } from "@/db"; // Adjust the import path to your db connection
import { books, inventory } from "@/db/schema"; // Import necessary tables
import Link from "next/link";

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: {
    title?: string;
    author?: string;
    availableOnly?: string;
  };
}) {
  try {
    const titleFilter = (searchParams?.title ?? "").toLowerCase();
    const authorFilter = (searchParams?.author ?? "").toLowerCase();
    const onlyAvailable = searchParams?.availableOnly === "true";
    let booksData = await db.select().from(books);

    // Filtering by title and author
    booksData = booksData.filter(
      (b) =>
        b.title.toLowerCase().includes(titleFilter) &&
        b.author.toLowerCase().includes(authorFilter)
    );

    // Optional: filter only those with inventory items
    if (onlyAvailable) {
      const availableBookIds = new Set<number>();
      const inventoryData = await db
        .select({ bookId: inventory.bookId })
        .from(inventory)
        .execute();
      inventoryData.forEach((i) => availableBookIds.add(i.bookId));
      booksData = booksData.filter((b) => availableBookIds.has(b.id));
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Available Books
        </h1>
        <form
          className="mb-6 flex flex-col md:flex-row items-start gap-4"
          method="GET"
        >
          <input
            type="text"
            name="title"
            placeholder="Search by title"
            defaultValue={searchParams?.title}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
          />
          <input
            type="text"
            name="author"
            placeholder="Search by author"
            defaultValue={searchParams?.author}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableOnly"
              value="true"
              defaultChecked={searchParams?.availableOnly === "true"}
              className="accent-blue-600"
            />
            Only available
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {booksData.length === 0 ? (
          <p className="text-center text-gray-600">
            No books available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {booksData.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id}>
                <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {book.title}
                  </h2>
                  <p className="text-gray-700 mt-1">by {book.author}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    ISBN: {book.isbn}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Published: {book.publishedDate?.toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred.";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading books: {errorMessage}
      </div>
    );
  }
}
