import { db } from "@/db";
import { books, locations, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { location: string };
}) {
  const locationId = parseInt(params.location, 10);

  if (isNaN(locationId)) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Invalid location ID.</div>;
  }

  try {
    const locationData = await db
      .select({
        name: locations.name,
        address: locations.address,
      })
      .from(locations)
      .where(eq(locations.id, locationId));

    if (locationData.length === 0) {
      return <div className="flex justify-center items-center min-h-screen text-red-500">Location not found.</div>;
    }

    const booksAtLocation = await db
      .select({
        title: books.title,
        quantity: inventory.quantity,
      })
      .from(inventory)
      .innerJoin(books, eq(inventory.bookId, books.id))
      .where(eq(inventory.locationId, locationId));

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">{locationData[0].name}</h1>
        <p className="text-center text-gray-700 mb-8">{locationData[0].address}</p>

        <h2 className="text-2xl font-semibold mb-4">Books Available</h2>

        {booksAtLocation.length === 0 ? (
          <p>No books available at this location.</p>
        ) : (
          <ul className="list-disc list-inside">
            {booksAtLocation.map((book, index) => (
              <li key={index} className="mb-2">
                <span className="font-medium">{book.title}</span>: {book.quantity} copies
              </li>
            ))}
          </ul>
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
