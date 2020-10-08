import fs from 'fs';
import _ from 'lodash';

const parse = (filepath) => {
  const rawJSON = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(rawJSON);
  return data;
};

const diff = (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const deletedFlag = '- ';
  const addedFlag = '+ ';
  const uniqueKeys = _.union(_.keys(data1), _.keys(data2));
  const deletedKeys = _.difference(uniqueKeys, _.keys(data2));
  const addedKeys = _.difference(uniqueKeys, _.keys(data1));
  const changedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys)
    .filter((item) => data1[item] !== data2[item]);

  const result = uniqueKeys.map((key) => {
    if (deletedKeys.includes(key)) {
      return `${deletedFlag}${key}: ${data1[key]}`;
    }
    if (addedKeys.includes(key)) {
      return `${addedFlag}${key}: ${data2[key]}`;
    }
    if (changedKeys.includes(key)) {
      return `${deletedFlag}${key}: ${data1[key]}\n${addedFlag}${key}: ${data2[key]}`;
    }

    return `  ${[key]}: ${data2[key]}`;
  })
    .join('\n');
  return `{\n${result}\n}`;
};
export default diff;
