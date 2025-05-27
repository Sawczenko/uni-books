// lib/schema.ts
import {
    pgTable,
    text,
    timestamp,
    integer,
    primaryKey,
    uniqueIndex,
    index,
    serial,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const locations = pgTable(
    'locations',
    {
        id: serial('id').notNull(),
        name: text('name').notNull(),
        address: text('address').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    },
    (locations) => [primaryKey({ columns: [locations.id] })],
);

export const books = pgTable(
    'books',
    {
        id: serial('id').notNull(),
        title: text('title').notNull(),
        author: text('author').notNull(),
        isbn: text('isbn').notNull(),
        publishedDate: timestamp('published_date', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    },
    (books) => [
        primaryKey({ columns: [books.id] }),
        uniqueIndex('isbn_idx').on(books.isbn),
    ],
);

export const inventory = pgTable(
    'inventory',
    {
        id: serial('id').notNull(),
        bookId: integer('book_id').notNull(),
        locationId: integer('location_id').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    },
    (inventory) => [primaryKey({ columns: [inventory.id] })],
);

export const rentals = pgTable(
    'rentals',
    {
        id: serial('id').notNull(),
        userId: integer('user_id').notNull(),
        inventoryId: integer('inventory_id').notNull(),
        rentalDate: timestamp('rental_date', { withTimezone: true }).notNull().defaultNow(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    },
    (rentals) => [primaryKey({ columns: [rentals.id] })],
);

export const users = pgTable(
    'user',
    {
        id: serial('id').primaryKey(),
        username: text('username').notNull(),
        passwordHash: text('password_hash').notNull(),
    },
    (users) => [index('username_idx').on(users.username)],
);

export const sessions = pgTable(
    'session',
    {
        id: text('id').primaryKey(),
        userId: integer('user_id').notNull().references(() => users.id),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    },
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

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
