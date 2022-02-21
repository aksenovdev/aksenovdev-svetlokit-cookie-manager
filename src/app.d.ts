/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

declare namespace App {
	interface Locals {
		userid: string;
		cookieManager: import('$lib/cookie-manager/server-cookie-manager').ServerCookieManager;
	}

	interface Platform {}

	interface Session {}

	interface Stuff {
		cookieManager: import('$lib/cookie-manager/browser-cookie-manager').BrowserCookieManager;
	}
}
