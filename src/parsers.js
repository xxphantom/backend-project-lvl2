import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const getParser = {
  '.yml': (yamlData) => yaml.safeLoad(yamlData),
  '.json': (jsonData) => JSON.parse(jsonData),
};

const getData = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf8');
  return rawData;
};

const parse = (filepath) => {
  const extname = path.extname(filepath) || '.json';
  const rawData = getData(filepath);
  const parser = getParser[extname];
  const parsedData = parser(rawData);
  return parsedData;
};
export default parse;
