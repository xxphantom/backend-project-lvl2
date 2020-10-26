import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';
import genAstDiff from './genAstDiff.js';

const getData = (filepath) => fs.readFileSync(filepath, 'utf8');
const getFormat = (filepath) => path.extname(filepath).slice(1);

const gendDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const toFormat = getFormatter(formatName);
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  const parsedData1 = parse(data1, format1);
  const parsedData2 = parse(data2, format2);
  const astTreeDiff = genAstDiff(parsedData1, parsedData2);

  return toFormat ? toFormat(astTreeDiff) : `Error: unexpected format: ${formatName}`;
};

export default gendDiff;
