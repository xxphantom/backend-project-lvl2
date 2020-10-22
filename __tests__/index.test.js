import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf8');

test.each([
  ['stylishDiff.txt', 'before.json', 'after.json'],
  ['stylishDiff.txt', 'before.yml', 'after.yml'],
])('%s (%s, %s)', (expected, before, after) => {
  const diff = gendiff(getFixturePath(before), getFixturePath(after), 'stylish');
  expect(diff).toBe(readFile(expected));
});

test.each([
  ['plainDiff.txt', 'before.json', 'after.json'],
  ['plainDiff.txt', 'before.yml', 'after.yml'],
])('%s (%s, %s)', (expected, before, after) => {
  const diff = gendiff(getFixturePath(before), getFixturePath(after), 'plain');
  expect(diff).toBe(readFile(expected));
});

test.each([
  ['jsonDiff.txt', 'before.json', 'after.json'],
  ['jsonDiff.txt', 'before.yml', 'after.yml'],
])('%s (%s, %s)', (expected, before, after) => {
  const diff = gendiff(getFixturePath(before), getFixturePath(after), 'json');
  expect(diff).toBe(readFile(expected));
});
