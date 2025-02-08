import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

export async function insertUser(user: table.User) {
	const email = user.email.toLowerCase();
	await db.insert(table.user).values({
		id: user.id,
		email,
		passwordHash: user.passwordHash,
		name: user.name,
		phoneNumber: user.phoneNumber
	});
}

export async function getUser(email: string) {
	const lowercaseEmail = email.toLowerCase();
	return await db.select().from(table.user).where(eq(table.user.email, lowercaseEmail));
}

export async function insertSession(session: table.Session) {
	return await db.insert(table.session).values(session);
}
