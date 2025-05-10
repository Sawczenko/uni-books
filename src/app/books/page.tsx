import { db } from "@/db"; // Adjust the import path to your db connection
import { books } from "@/db/schema"; // Import necessary tables

export default async function BooksPage() {
  try {
    let booksData = await db.select().from(books);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Available Books</h1>
        {booksData.length === 0 ? (
          <p className="text-center text-gray-600">
            No books available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {booksData.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {book.title}
                </h2>
                <p className="text-gray-700 mt-1">by {book.author}</p>
                <p className="text-gray-600 text-sm mt-2">ISBN: {book.isbn}</p>
                <p className="text-gray-600 text-sm">
                  Published: {book.publishedDate?.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error: any) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading books: {error.message}
      </div>
    );
  }
}
