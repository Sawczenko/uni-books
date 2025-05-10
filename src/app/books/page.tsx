import { db } from '@/db'; // Adjust the import path to your db connection
import { books, inventory, locations } from '@/db/schema'; // Import necessary tables
import { eq } from 'drizzle-orm';


export default async function BooksPage() {
  let booksData: any[] = []; // Use a more specific type if possible
  let error: string | null = null;

  try {
    booksData = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        isbn: books.isbn,
        publishedDate: books.publishedDate,
        locationName: locations.name,
        quantity: inventory.quantity,
      })
      .from(books)
      .leftJoin(inventory, eq(books.id, inventory.bookId))
      .leftJoin(locations, eq(inventory.locationId, locations.id));
  } catch (err: any) {
    console.error("Error fetching books:", err);
    error = "Failed to load books.";
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading books: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Books</h1>
      {booksData.length === 0 ? (
        <p className="text-center text-gray-600">No books available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksData.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900">{book.title}</h2>
              <p className="text-gray-700 mt-1">by {book.author}</p>
              <p className="text-gray-600 text-sm mt-2">ISBN: {book.isbn}</p>
              <p className="text-gray-600 text-sm">Published: {new Date(book.publishedDate).toLocaleDateString()}</p>
              <p className="text-gray-800 font-medium mt-4">
                Location: {book.locationName} - Quantity: {book.quantity}
              </p>
              {/* You can add a button or link for renting here */}
              {/* <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Rent</button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}