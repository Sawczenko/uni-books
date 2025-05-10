import { db } from '../db';
import { books, inventory, locations } from '../db/schema';
import { eq } from 'drizzle-orm';

// Assuming a Next.js API route structure
// For Express, the structure would be slightly different

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const result = await db
        .select({
          id: books.id,
          title: books.title,
          author: books.author,
          isbn: books.isbn,
          publishedDate: books.publishedDate,
          locationName: locations.name,
          quantity: inventory.quantity,
        })
        .from(books)
        .leftJoin(inventory, eq(books.id, inventory.bookId))
        .leftJoin(locations, eq(inventory.locationId, locations.id));

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching books:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}