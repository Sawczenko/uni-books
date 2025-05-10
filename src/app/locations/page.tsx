import { db } from '@/db'; // Adjust the import path to your db connection
import { locations } from '@/db/schema'; // Import necessary tables
import { eq } from 'drizzle-orm';

export default async function LocationsPage() {
  let locationsData: any[] = []; // Use a more specific type if possible
  let error: string | null = null;

  try {
    locationsData = await db
      .select({
        id: locations.id,
        name: locations.name,
        address: locations.address,
      })
      .from(locations);
  } catch (err: any) {
    console.error("Error fetching locations:", err);
    error = "Failed to load locations.";
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading locations: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Locations</h1>
      {locationsData.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locationsData.map((location) => (
            <div key={location.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold">{location.name}</h2>
              <p className="text-gray-700 mt-1">{location.address}</p>
              {/* You can add more location details here if needed */}
              {/* Example: <p className="text-gray-600 text-sm mt-2">Phone: {location.phone}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}