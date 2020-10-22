import fs from 'fs';
import path from 'path';

const dataLoader = (filepath) => {
  const fileFormat = path.extname(filepath) || '.json';
  const data = fs.readFileSync(filepath, 'utf8');
  return [data, fileFormat];
};

export default dataLoader;
