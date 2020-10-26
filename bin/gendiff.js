#!/usr/bin/env node
import program from 'commander';
import process from 'process';
import path from 'path';
import genDiff from '../src/index.js';

const version = '1.0.0';
const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, cmdObj) => {
    console.log(genDiff(buildFullPath(filepath1), buildFullPath(filepath2), cmdObj.format));
  });
program.parse(process.argv);
