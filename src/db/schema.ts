import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (users) => ({
    usersId: primaryKey(users.id),
    emailIndex: uniqueIndex("email_idx").on(users.email),
  })
);

export const locations = mysqlTable(
  "locations",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (locations) => ({
    locationsId: primaryKey(locations.id),
  })
);

export const books = mysqlTable(
  "books",
  {
    id: int("id").autoincrement().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    isbn: varchar("isbn", { length: 255 }).notNull().unique(),
    publishedDate: timestamp("published_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (books) => ({
    booksId: primaryKey(books.id),
    isbnIndex: uniqueIndex("isbn_idx").on(books.isbn),
  })
);

export const inventory = mysqlTable(
  "inventory",
  {
    id: int("id").autoincrement().notNull(),
    bookId: int("book_id").notNull(),
    locationId: int("location_id").notNull(),
    quantity: int("quantity").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (inventory) => ({
    inventoryId: primaryKey(inventory.id),
  })
);

export const rentals = mysqlTable(
  "rentals",
  {
    id: int("id").autoincrement().notNull(),
    userId: int("user_id").notNull(),
    inventoryId: int("inventory_id").notNull(),
    rentalDate: timestamp("rental_date").notNull().defaultNow(),
    dueDate: timestamp("due_date").notNull(),
    returnDate: timestamp("return_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  },
  (rentals) => ({
    rentalsId: primaryKey(rentals.id),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  rentals: many(rentals),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  inventory: many(inventory),
}));

export const booksRelations = relations(books, ({ many }) => ({
  inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  book: one(books, {
    fields: [inventory.bookId],
    references: [books.id],
  }),
  location: one(locations, {
    fields: [inventory.locationId],
    references: [locations.id],
  }),
  rentals: many(rentals),
}));

export const rentalsRelations = relations(rentals, ({ one }) => ({
  user: one(users, {
    fields: [rentals.userId],
    references: [users.id],
  }),
  inventory: one(inventory, {
    fields: [rentals.inventoryId],
    references: [inventory.id],
  }),
}));