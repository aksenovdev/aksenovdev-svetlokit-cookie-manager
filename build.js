import { execSync } from 'child_process';
import { rmSync } from 'fs';
import { TEMP_PACKAGE_PATH } from './svelte.config.js';

export const PACKAGE_PATH = './package';
export { TEMP_PACKAGE_PATH };

rmSync(PACKAGE_PATH, { recursive: true, force: true });

execSync('svelte-kit package');
console.log('Package created');

execSync(`npx rollup -c ./rollup.config.js --input '${TEMP_PACKAGE_PATH}' --output '${PACKAGE_PATH}'`);
console.log('Package bundled');

rmSync(TEMP_PACKAGE_PATH, { recursive: true, force: true });

console.log('npm publish ./package');
