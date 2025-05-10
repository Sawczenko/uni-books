export default function Home() {
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
          <a href="/locations" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Browse Locations
          </a>
          <a href="/books" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
            Browse Books
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Add content for the footer link if needed */}
        </a>  
      </footer>
    </div>
  );
}
