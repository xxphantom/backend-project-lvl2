import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf8');

test('FlatJsonDiff', () => {
  const expected = 'file1ToFile2Diff.txt';
  expect(readFile(expected)).toMatch(gendiff(getFixturePath('file1.json'), getFixturePath('file2.json')));
});