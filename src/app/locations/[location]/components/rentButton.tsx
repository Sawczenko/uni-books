"use client";

import { useActionState } from "react";
import { returnBook, rentBook } from "../actions";

export function RentButton({
  inventoryId,
  userId,
  locationId,
}: {
  inventoryId: number;
  userId: number;
  locationId: number;
}) {
  const [_, rentAction] = useActionState(rentBook, null);

  return (
    <form action={rentAction}>
      <input type="hidden" name="inventoryId" value={inventoryId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="locationId" value={locationId} />
      <button
        type="submit"
        className="bg-white rounded-lg shadow-md p-2 text-gray-700 hover:bg-gray-100"
      >
        Rent
      </button>
    </form>
  );
}

export function ReturnButton({
  inventoryId,
  userId,
  locationId,
}: {
  inventoryId: number;
  userId: number;
  locationId: number;
}) {
  const [_, returnAction] = useActionState(returnBook, null);

  return (
    <form action={returnAction}>
      <input type="hidden" name="inventoryId" value={inventoryId} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="locationId" value={locationId} />
      <button
        type="submit"
        className="bg-white rounded-lg shadow-md p-2 text-gray-700 hover:bg-gray-100"
      >
        Return
      </button>
    </form>
  );
}
