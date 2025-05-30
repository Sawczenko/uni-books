import SearchForm from "./components/searchForm";
import BookAtLocation from "./components/bookAtLocation";
import {getCurrentSession} from "@/app/auth/session";
import {db} from "@/db";
import {inventory, books, locations, users} from "@/db/schema";
import {eq, count} from "drizzle-orm";

type SearchParams = {
  searchParams: Promise<{searchTerm: string}>
  params: Promise<{location: string}>
}

export default async function LocationPage({ searchParams, params }: SearchParams) {

  const search = await searchParams;
  const parameters = await params;
  const locId = parseInt(parameters.location, 10);
  const { user } = await getCurrentSession();
  const userId = user?.id ?? 0;


  const locationData = await db
      .select({
        name: locations.name,
        address: locations.address,
      })
      .from(locations)
      .where(eq(locations.id, locId));
  if (locationData.length === 0) {
    return (
        <div className="flex justify-center items-center text-red-500">
          Location not found.
        </div>
    );
  }

  const allBooks = await db
    .select({ id: books.id, title: books.title, author: books.author })
    .from(inventory)
    .innerJoin(books, eq(inventory.bookId, books.id))
    .where(eq(inventory.locationId, locId))
    .groupBy(books.id)
    .execute();

  const term = search?.searchTerm?.toLowerCase().trim() ?? "";
  const filtered = allBooks.filter((b) =>
    term === "" ? true : (b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term))
  );

  const locationName = locationData[0].name;

  return (
      <div className="container mx-auto px-4 py-6">
        <SearchForm />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">
          {locationName}
        </h2>
        <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((b) => (
          <BookAtLocation
            key={b.id}
            bookId={b.id}
            locationId={locId}
            userId={userId}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">
            No books match your search.
          </p>
        )}
      </div>
    </div>
  );
}
