"use client";

import {useActionState} from "react";
import {rentBook, returnBook} from "../actions";

export function RentButton({
                               inventoryId,
                               userId,
                               locationId,
                           }: {
    inventoryId: number;
    userId: number;
    locationId: number;
}) {
    const [, rentAction] = useActionState(rentBook, null);

    return (
        <form action={rentAction}>
            <input type="hidden" name="inventoryId" value={inventoryId}/>
            <input type="hidden" name="userId" value={userId}/>
            <input type="hidden" name="locationId" value={locationId}/>
            <button
                type="submit"
                className="rounded-lg shadow-md p-2 text-white font-bold bg-blue-500 hover:bg-blue-700"
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
    const [, returnAction] = useActionState(returnBook, null);

    return (
        <form action={returnAction}>
            <input type="hidden" name="inventoryId" value={inventoryId}/>
            <input type="hidden" name="userId" value={userId}/>
            <input type="hidden" name="locationId" value={locationId}/>
            <button
                type="submit"
                className="rounded-lg shadow-md p-2 text-white font-bold bg-green-500 hover:bg-green-700"
            >
                Return
            </button>
        </form>
    );
}
