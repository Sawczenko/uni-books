import { db } from "@/db";
import { books } from "@/db/schema";

export const allBooks = () => db.select().from(books);
