#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. Clean previous builds
fs.rmSync('./dist', { recursive: true, force: true });

// 2. Build both module systems
console.log('Building ESM version...');
execSync('tsc -p tsconfig.esm.json', { stdio: 'inherit' });

console.log('Building CJS version...');
execSync('tsc -p tsconfig.cjs.json', { stdio: 'inherit' });

// 3. Add module-specific package.json files
const createPackageJson = (type) => ({
  type,
  sideEffects: false,
  private: true
});

['esm', 'cjs'].forEach((format) => {
  const dir = `./dist/${format}`;
  fs.writeFileSync(
    `${dir}/package.json`,
    JSON.stringify(createPackageJson(format === 'esm' ? 'module' : 'commonjs'), 
    2
  );
});

// 4. Copy non-TS assets
const copyAssets = (source, target) => {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true });
};

['public', 'locales'].forEach((dir) => {
  copyAssets(`./src/${dir}`, './dist/esm/' + dir);
  copyAssets(`./src/${dir}`, './dist/cjs/' + dir);
});

console.log('Build completed successfully!');