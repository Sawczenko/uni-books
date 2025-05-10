import { db } from '../db';
import { rentals, inventory, users } from '../db/schema';
import { eq, and } from 'drizzle-orm';

// Assume this is part of your API route handler (e.g., in Next.js or Express)

// API endpoint for renting a book
export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { userId, inventoryId } = req.body;

    if (!userId || !inventoryId) {
      return res.status(400).json({ message: 'User ID and Inventory ID are required' });
    }

    try {
      // Check if the book is available
      const inventoryItem = await db.select()
        .from(inventory)
        .where(eq(inventory.id, inventoryId))
        .limit(1);

      if (inventoryItem.length === 0 || inventoryItem[0].quantity <= 0) {
        return res.status(400).json({ message: 'Book not available for rent at this location' });
      }

      // Check if the user exists
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create a new rental record
      const newRental = await db.insert(rentals).values({
        userId,
        inventoryId,
        rentalDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: 7 days rental period
      });

      // Decrease the inventory quantity
      await db.update(inventory)
        .set({ quantity: inventoryItem[0].quantity - 1 })
        .where(eq(inventory.id, inventoryId));

      return res.status(201).json({ message: 'Book rented successfully', rentalId: newRental[0]?.insertId });
    } catch (error) {
      console.error('Error renting book:', error);
      return res.status(500).json({ message: 'Error renting book' });
    }
  } else if (req.method === 'GET') {
    // API endpoint for viewing user's rented books
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const userRentals = await db.select({
        rentalId: rentals.id,
        bookTitle: inventory.bookId, // This would ideally join with the books table to get the title
        locationName: inventory.locationId, // This would ideally join with the locations table to get the name
        rentalDate: rentals.rentalDate,
        dueDate: rentals.dueDate,
        returnDate: rentals.returnDate,
      })
        .from(rentals)
        .where(eq(rentals.userId, userId))
        .leftJoin(inventory, eq(rentals.inventoryId, inventory.id)); // Join with inventory

      // TODO: Join with 'books' and 'locations' tables to get actual book titles and location names

      return res.status(200).json(userRentals);
    } catch (error) {
      console.error('Error fetching user rentals:', error);
      return res.status(500).json({ message: 'Error fetching user rentals' });
    }
  } else if (req.method === 'PUT') {
    // API endpoint for returning a book
    const { rentalId } = req.body;

    if (!rentalId) {
      return res.status(400).json({ message: 'Rental ID is required' });
    }

    try {
      const rentalToReturn = await db.select().from(rentals).where(eq(rentals.id, rentalId)).limit(1);

      if (rentalToReturn.length === 0) {
        return res.status(404).json({ message: 'Rental not found' });
      }

      if (rentalToReturn[0].returnDate !== null) {
        return res.status(400).json({ message: 'Book has already been returned' });
      }

      // Update the rental record with return date
      await db.update(rentals)
        .set({ returnDate: new Date() })
        .where(eq(rentals.id, rentalId));

      // Increase the inventory quantity
      await db.update(inventory)
        .set({ quantity: inventory.quantity + 1 }) // Increment the quantity
        .where(eq(inventory.id, rentalToReturn[0].inventoryId));

      return res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
      console.error('Error returning book:', error);
      return res.status(500).json({ message: 'Error returning book' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}