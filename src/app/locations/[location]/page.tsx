import { getCurrentSession } from "@/app/auth/session";
import { db } from "@/db";
import { locations, inventory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookAtLocation from "./components/bookAtLocation";

export default async function Page({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const locationId = +(await params).location;
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/auth/login");
  }

  if (isNaN(locationId)) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Invalid location ID.
      </div>
    );
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
      return (
        <div className="flex justify-center items-center min-h-screen text-red-500">
          Location not found.
        </div>
      );
    }

    const bookIdsAtLocation = await db
      .selectDistinct({
        bookId: inventory.bookId,
      })
      .from(inventory)
      .where(eq(inventory.locationId, locationId));

    if (bookIdsAtLocation.length === 0) {
      return (
        <div className="flex justify-center items-center min-h-screen text-red-500">
          No books found at this location.
        </div>
      );
    }

    return (
      <div>
        {bookIdsAtLocation.map((book) => (
          <BookAtLocation
            key={book.bookId}
            bookId={book.bookId}
            locationId={locationId}
            userId={user.id}
          />
        ))}
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
