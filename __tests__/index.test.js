import { test, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf8');

test('flatJsonDiff', () => {
  const expected = 'flatDiff.txt';
  const diff = gendiff(getFixturePath('before.json'), getFixturePath('after.json'));
  expect(diff).toBe(readFile(expected));
});

test('flatYamlDiff', () => {
  const expected = 'flatDiff.txt';
  const diff = gendiff(getFixturePath('before.yml'), getFixturePath('after.yml'));
  expect(diff).toBe(readFile(expected));
});

test('flatYamlJsonDiff', () => {
  const expected = 'flatDiff.txt';
  const diff = gendiff(getFixturePath('before.yml'), getFixturePath('after.json'));
  expect(diff).toBe(readFile(expected));
});

test('flatJson without ".json" extname Diff', () => {
  const expected = 'flatDiff.txt';
  const diff = gendiff(getFixturePath('before.yml'), getFixturePath('after.json'));
  expect(diff).toBe(readFile(expected));
});
