import Link from "next/link";
import { getCurrentSession } from "./auth/session";

export default async function Home() {
    const { user } = await getCurrentSession();     
    const isAdmin = user?.username === "admin";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <main className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Welcome to Your Book Rental Store!
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Find your next great read at one of our many convenient locations.
                    </p>
                </div>
                <div className="mt-6">
                    <p className="text-gray-700">
                        Browse our extensive collection of books or discover a new favorite
                        by exploring our different store locations. Renting is easy and
                        convenient!
                    </p>
                </div>
                <div className="flex justify-center gap-4 mt-8">
                    <Link
                        href="/locations"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                        Browse Locations
                    </Link>
                    <Link
                        href="/rentals"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Show rented books
                    </Link>
                    <Link
                        href="/books"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                    >
                        Browse Books
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/adminPage"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            Admin Dashboard
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
}
