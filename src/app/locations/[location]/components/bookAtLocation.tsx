import { db } from "@/db";
import { and, eq, count } from "drizzle-orm";
import { rentals, inventory, books } from "@/db/schema";
import { RentButton, ReturnButton } from "./rentButton";

export default async function BookAtLocation({
  bookId,
  locationId,
  userId,
}: {
  bookId: number;
  locationId: number;
  userId: number;
}) {
  try {
    const inventoryItems = await db
      .select({
        id: inventory.id,
        bookTitle: books.title,
        quantity: count(),
      })
      .from(inventory)
      .innerJoin(books, eq(inventory.bookId, books.id))
      .where(
        and(eq(inventory.bookId, bookId), eq(inventory.locationId, locationId)),
      )
      .groupBy(inventory.id);

    const totalQuantity = inventoryItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    let availableQuantity = totalQuantity;
    let isRentedByUser = false;

    for (const item of inventoryItems) {
      const rentedItems = await db
        .select()
        .from(rentals)
        .where(
          and(eq(rentals.inventoryId, item.id), eq(rentals.userId, userId)),
        );

      if (rentedItems.length > 0) {
        availableQuantity -= 1;
        isRentedByUser = true;
      }
    }

    if (totalQuantity == 0) {
      return (
        <div className="flex justify-center items-center min-h-screen text-gray-500">
          No copies available for this book at this location.
        </div>
      );
    }

    return (
      <div>
        <div className="text-xl">{inventoryItems[0].bookTitle}</div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 mb-1">
            Total Quantity: {totalQuantity}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Available Quantity: {availableQuantity}
          </p>
          {!isRentedByUser ? (
            <RentButton
              inventoryId={inventoryItems[0].id}
              userId={userId}
              locationId={locationId}
            />
          ) : (
            <ReturnButton
              inventoryId={inventoryItems[0].id}
              userId={userId}
              locationId={locationId}
            />
          )}
          <hr />
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading book data: {err.message}
      </div>
    );
  }
}
