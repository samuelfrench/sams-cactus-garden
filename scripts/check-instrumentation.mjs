import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const measurementId = 'G-9W5MQJLGRD';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);

assert.ok(headMatch, 'index.html must contain one closed head element');
assert.equal((html.match(/<head\b/gi) ?? []).length, 1, 'index.html must contain exactly one head element');

const head = headMatch[1];
const loader = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
const configPattern = new RegExp(`gtag\\(\\s*['"]config['"]\\s*,\\s*['"]${measurementId}['"]\\s*\\)`, 'g');
const verificationPattern = /<meta\s+name=["']google-site-verification["']\s+content=["'][^"']+["']\s*\/?>/gi;

assert.equal(html.split(loader).length - 1, 1, 'the exact GA loader must occur once');
assert.equal((html.match(configPattern) ?? []).length, 1, 'the exact GA config must occur once');
assert.equal((html.match(verificationPattern) ?? []).length, 1, 'one nonempty verification META must occur');
assert.ok(head.includes(loader), 'the loader must be inside head');
assert.match(head, configPattern, 'the config must be inside head');
assert.equal((head.match(verificationPattern) ?? []).length, 1, 'the verification META must be inside head');

console.log(`Instrumentation markup valid for ${measurementId}`);
