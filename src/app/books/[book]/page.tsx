import { db } from "@/db";
import { books, locations, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const bookId = parseInt((await params).book, 10);

  if (isNaN(bookId)) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Invalid book ID.
      </div>
    );
  }

  try {
    const bookData = await db
      .select({
        name: books.title,
        author: books.author,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1)
      .execute();

    if (bookData.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-screen text-red-500">
          Book not found.
        </div>
      );
    }

    const locationsForBook = await db
      .selectDistinct({
        id: locations.id,
        name: locations.name,
        address: locations.address,
      })
      .from(locations)
      .innerJoin(inventory, eq(locations.id, inventory.locationId))
      .where(eq(inventory.bookId, bookId))
      .execute();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {bookData[0].name}
        </h1>
        <p className="text-center text-gray-700 mb-8">{bookData[0].author}</p>

        {locationsForBook.length === 0 ? (
          <p>Book unavailable at any locations</p>
        ) : (
          <div>
            <div>Available at:</div>
            <ul className="list-disc list-inside">
              {locationsForBook.map((loc, index) => (
                <Link href={`/locations/${loc.id}`} key={index}>
                  <li key={index} className="mb-2">
                    <span className="font-medium">{loc.name}</span>:{" "}
                    {loc.address}{" "}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (err: any) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading locations: {err.message}
      </div>
    );
  }
}
