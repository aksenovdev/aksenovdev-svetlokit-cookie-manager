import { execSync } from 'child_process';
import { rmSync } from 'fs';

rmSync('./package', { recursive: true, force: true });
rmSync('./temp-package', { recursive: true, force: true });

execSync('pnpm package');
console.log('Package created');

execSync('npx rollup -c ./rollup.config.js');
console.log('Package bundled');

rmSync('./temp-package', { recursive: true, force: true });

console.log('npm publish ./package');
