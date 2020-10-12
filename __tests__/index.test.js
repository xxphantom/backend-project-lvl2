import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import gendiff from '../src/index.js';

test('flatJsonDiff', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
  const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf8');
  const expected = 'diff.txt';

  const diff = gendiff(getFixturePath('before.json'), getFixturePath('after.json'));

  expect(diff).toBe(readFile(expected));
});
