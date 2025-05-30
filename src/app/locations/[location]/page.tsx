import SearchForm from "./components/searchForm";
import BookAtLocation from "./components/bookAtLocation";
import {getCurrentSession} from "@/app/auth/session";
import {db} from "@/db";
import {inventory, books} from "@/db/schema";
import {eq} from "drizzle-orm";

export default async function LocationPage({
  params,
  searchParams,
}: {
  params: { location: string };
  searchParams?: { searchTerm?: string };
}) {
  const locId = parseInt(params.location, 10);
  const { user } = await getCurrentSession();
  const userId = user?.id ?? 0;

  // 1. Fetch all unique books available at this location
  const allBooks = await db
    .select({ id: books.id, title: books.title })
    .from(inventory)
    .innerJoin(books, eq(inventory.bookId, books.id))
    .where(eq(inventory.locationId, locId))
    .groupBy(books.id)
    .execute();

  // 2. Extract searchTerm and filter by title (case-insensitive)
  const term = searchParams?.searchTerm?.toLowerCase().trim() ?? "";
  const filtered = allBooks.filter((b) =>
    term === "" ? true : b.title.toLowerCase().includes(term)
  );

  return (
    <div className="px-6 py-10">
      <SearchForm />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
