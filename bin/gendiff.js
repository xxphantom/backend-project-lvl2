#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import process from 'process';
import diff from '../src/index.js';

const version = '1.0.0';
const fullPath = (filepath) => path.resolve(process.cwd(), filepath);

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, cmdObj) => {
    console.log(diff(fullPath(filepath1), fullPath(filepath2), cmdObj.format));
  });
program.parse(process.argv);
