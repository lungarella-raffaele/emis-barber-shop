import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$lib/validation/register';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}

	return {
		form: await superValidate(zod(registerSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, {
				message: `Le informazioni che hai inserito non sono valide. Riprova.`,
				form
			});
		}

		const results = await db.select().from(table.user).where(eq(table.user.email, form.data.email));

		const existingUser = results.at(0);
		if (existingUser) {
			return fail(400, {
				message: `L'email che hai inserito è gia un uso. Prova con un altro indirizzo email.`,
				form
			});
		}

		const { email, password, firstName, lastName } = form.data;

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({ id: userId, email, passwordHash, lastName, firstName });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			console.log(e);
			return fail(500, { message: 'Al momento il servizio non risponde. Riprova in seguito.' });
		}
		return redirect(302, '/');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
