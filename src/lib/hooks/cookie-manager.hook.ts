import type { Handle } from '@sveltejs/kit';
import type { ServerCookieManager } from '../managers/server-cookie-manager';
import { getServerCookieManager } from '../managers/server-cookie-manager';

export const cookieManagerHook: Handle
	= async ({ event, resolve }) => {
		const manager: ServerCookieManager = (event.locals as any).cookieManager
			= (event.locals as any).cookieManager || getServerCookieManager(event.request.headers.get('cookie'));

		const response = await resolve(event);

		const managerCookieHeaders: string[] = manager.getCookieHeader();
		managerCookieHeaders
			.forEach((cookieHeader: string) => response.headers.append('set-cookie', cookieHeader));

		return response;
	};
