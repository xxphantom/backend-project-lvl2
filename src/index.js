import _ from 'lodash';
import parse from './parsers.js';

const deletedFlag = '- ';
const addedFlag = '+ ';
const startBracket = '{\n';
const endBracket = '\n}\n';

const diff = (filepath1, filepath2) => {
  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const uniqueKeys = _.union(_.keys(data1), _.keys(data2));
  const deletedKeys = _.difference(uniqueKeys, _.keys(data2));
  const addedKeys = _.difference(uniqueKeys, _.keys(data1));
  const changedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys)
    .filter((item) => data1[item] !== data2[item]);
  const unchangedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys, changedKeys);

  const deletedLines = deletedKeys
    .map((key) => `${deletedFlag}${key}: ${data1[key]}`);
  const addedLines = addedKeys
    .map((key) => `${addedFlag}${key}: ${data2[key]}`);
  const changedLines = changedKeys
    .map((key) => `${deletedFlag}${key}: ${data1[key]}\n${addedFlag}${key}: ${data2[key]}`);
  const unchangedLines = unchangedKeys
    .map((key) => `  ${[key]}: ${data2[key]}`);
  return `${startBracket}${[...unchangedLines, ...changedLines, ...deletedLines, ...addedLines].join('\n')}${endBracket}`;
};
export default diff;
