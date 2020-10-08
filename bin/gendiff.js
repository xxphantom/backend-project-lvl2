#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import process from 'process';
import diff from '../src/index.js';

const version = '1.0.0';
const convertToAbsPath = (relFilepath) => path.resolve(process.cwd(), relFilepath);

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    console.log(diff(convertToAbsPath(filepath1), convertToAbsPath(filepath2)));
  });
program.parse(process.argv);
