import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf8');
const formatters = ['stylish', 'plain', 'json'];
const formats = ['json', 'yml'];
const testCombinations = formatters
  .flatMap((formatter) => formats.map((format) => [formatter, format]));

test.each(testCombinations)('Diff in %s from %s', (formatter, format) => {
  const diff = gendiff(getFixturePath(`before.${format}`), getFixturePath(`after.${format}`), formatter);
  expect(diff).toBe(readFixture(`${formatter}Diff.txt`));
});
