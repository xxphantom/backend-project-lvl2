import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';
import genAstDiff from './genAstDiff.js';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const getData = (filepath) => fs.readFileSync(buildFullPath(filepath), 'utf8');
const getFormat = (filepath) => path.extname(filepath).slice(1);

const gendDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const toFormat = getFormatter(formatName);
  if (!toFormat) {
    return `Error: unexpected format: ${formatName}`;
  }
  const parsedData1 = parse(getData(filepath1), getFormat(filepath1));
  const parsedData2 = parse(getData(filepath2), getFormat(filepath2));
  const astTreeDiff = genAstDiff(parsedData1, parsedData2);

  return toFormat(astTreeDiff);
};

export default gendDiff;
