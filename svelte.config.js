import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

export const TEMP_PACKAGE_PATH = './temp-package';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		package: {
			dir: TEMP_PACKAGE_PATH,
		},
		adapter: adapter(),
	}
};

export default config;
