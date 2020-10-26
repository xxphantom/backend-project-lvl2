import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';
import genDiffAst from './genDiffAst.js';

const dataType = { json: 'json', yml: 'yaml', yaml: 'yaml' };

const getData = (filepath) => fs.readFileSync(filepath, 'utf8');
const getDataType = (filepath) => {
  const fileExtension = path.extname(filepath).slice(1);
  return dataType[fileExtension];
};

const gendDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const toFormat = getFormatter(formatName);
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const type1 = getDataType(filepath1);
  const type2 = getDataType(filepath2);
  const parsedData1 = parse(data1, type1);
  const parsedData2 = parse(data2, type2);
  const astTreeDiff = genDiffAst(parsedData1, parsedData2);

  return toFormat ? toFormat(astTreeDiff) : `Error: unexpected format: ${formatName}`;
};

export default gendDiff;
