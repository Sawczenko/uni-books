"use client";

import { useState, useEffect } from 'react';

interface Location {
  id: number;
  name: string;
  address: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: Location[] = await response.json();
        setLocations(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading locations...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Our Locations</h1>
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <li key={location.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{location.name}</h2>
              <p className="text-gray-600">{location.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}