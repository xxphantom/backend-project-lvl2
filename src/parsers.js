import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parsers = {
  '.yml': (yamlData) => yaml.safeLoad(yamlData),
  '.json': (jsonData) => JSON.parse(jsonData),
};

const parse = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf8');
  const extname = path.extname(filepath) || '.json';
  const data = parsers[extname](rawData);
  return data;
};
export default parse;
