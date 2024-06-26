import { prisma } from '@//server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const techs = await prisma.tech.findMany({
		select: {
			id: true,
			name: true,
			logo: true,
			updatedAt: true
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});
	return { techs };
}) satisfies PageServerLoad;
