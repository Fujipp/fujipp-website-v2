/**
 * Pre-build script to update version.json with current build timestamp
 * Run: node scripts/update-version.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionPath = path.join(__dirname, '../public/version.json');

// Read current version.json
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));

// Update build date to current time
const now = new Date();
versionData.buildDate = now.toISOString();

// Write updated version.json
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

console.log(`✅ Updated version to ${versionData.version}`);
console.log(`📅 Build date: ${versionData.buildDate}`);

