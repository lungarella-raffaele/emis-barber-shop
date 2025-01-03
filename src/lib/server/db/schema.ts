import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phoneNumber: text('phone_number'),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userID: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const booking = sqliteTable('booking', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	date: text('date')
});

export const service = sqliteTable('service', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Booking = typeof booking.$inferSelect;
export type Service = typeof service.$inferSelect;
