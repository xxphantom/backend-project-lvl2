#!/usr/bin/env node

import program from 'commander';

const version = '1.0.0';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format');
program.parse(process.argv);
