import { db } from "@/db"; // Adjust the import path to your db connection
import { locations } from "@/db/schema"; // Import necessary tables
import Link from "next/link";

export default async function LocationsPage() {
  try {
    let locationsData = await db.select().from(locations);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Our Locations</h1>
        {locationsData.length === 0 ? (
          <p>No locations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationsData.map((location) => (
              <Link
                key={location.id}
                href={`/locations/${location.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div
                  key={location.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-gray-700 text-xl font-semibold">
                    {location.name}
                  </h2>
                  <p className="text-gray-700 mt-1">{location.address}</p>
                </div>
              </Link>
            ))}
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
