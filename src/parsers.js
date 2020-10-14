import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.yml': (yamlData) => yaml.safeLoad(yamlData),
  '.json': (jsonData) => JSON.parse(jsonData),
  '.ini': (iniData) => ini.parse(iniData),
};

const parse = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf8');
  const extname = path.extname(filepath) || '.json';
  const data = parsers[extname](rawData);
  return data;
};
export default parse;
