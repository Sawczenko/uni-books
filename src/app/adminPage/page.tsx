import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";
import { users, rentals, inventory, books } from "@/db/schema";
import { db } from "@/db";
import { eq, count } from "drizzle-orm";

export default async function AdminPage() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/auth/login");
  if (user.username !== "admin") {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        You do not have permission to view this page.
      </div>
    );
  }

  try {
    // 1. Total number of books in inventory
    const totalResult = await db
      .select({ totalBooks: count() })
      .from(inventory)
      .execute();
    const totalBooks = totalResult[0]?.totalBooks ?? 0;

    // 1a. Breakdown of inventory by specific book
    const stockByBook = await db
      .select({ title: books.title, inStock: count() })
      .from(inventory)
      .innerJoin(books, eq(inventory.bookId, books.id))
      .groupBy(books.title)
      .execute();

    // 2. All users
    const allUsers = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .execute();

    // 3. All rentals joined with book titles
    const rentalRows = await db
      .select({
        userId: rentals.userId,
        bookTitle: books.title,
      })
      .from(rentals)
      .innerJoin(inventory, eq(rentals.inventoryId, inventory.id))
      .innerJoin(books, eq(inventory.bookId, books.id))
      .execute();

    // Group rentals by user
    const userMap = new Map<number, { username: string; rentals: string[] }>();
    allUsers.forEach((u) => userMap.set(u.id, { username: u.username, rentals: [] }));
    rentalRows.forEach((r) => userMap.get(r.userId)?.rentals.push(r.bookTitle));

    return (
      <div className="container mx-auto px-6 py-10 space-y-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            Total books in stock:{" "}
            <span className="text-blue-600">{totalBooks}</span>
          </h2>
          <div className="mt-4">
            <h3 className="text-xl font-medium">Stock by Book:</h3>
            <ul className="list-disc list-inside mt-2">
              {stockByBook.map((b) => (
                <li key={b.title}>
                  <span className="font-semibold">{b.title}</span>:{" "}
                  {b.inStock}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6">
          {[...userMap.values()]
            .filter((u) => u.rentals.length > 0)
            .map((u) => (
              <div
                key={u.username}
                className="p-6 bg-white rounded-2xl shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2">{u.username}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {u.rentals.map((title, i) => (
                    <li key={i} className="text-gray-700">
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </section>
      </div>
    );
  } catch (err: unknown) {
    let msg = "An unknown error occurred.";
    if (err instanceof Error) msg = err.message;
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading admin data: {msg}
      </div>
    );
  }
}
