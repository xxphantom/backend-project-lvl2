#!/usr/bin/env node

import program from 'commander';

const version = '1.0.0';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')

program.parse(process.argv);
