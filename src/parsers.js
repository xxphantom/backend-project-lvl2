import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

const type = {
  '.yml': (yamlData) => yaml.safeLoad(yamlData),
  '.json': (jsonData) => JSON.parse(jsonData),
};

const parse = (filepath) => {
  const rawData = fs.readFileSync(filepath, 'utf8');
  const extname = path.extname(filepath);
  const data = type[extname](rawData);
  return data;
};
export default parse;
