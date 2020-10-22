import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';
import dataLoader from './dataLoader.js';

const diff = (filepath1, filepath2, format = 'stylish') => {
  const formatter = getFormatter(format);
  const [rawData1, fileFormat1] = dataLoader(filepath1);
  const [rawData2, fileFormat2] = dataLoader(filepath2);
  const parsedData1 = parse(rawData1, fileFormat1);
  const parsedData2 = parse(rawData2, fileFormat2);

  const iter = (data1, data2) => {
    const uniqueKeys = _.union(_.keys(data2), _.keys(data1));
    const nodeKeys = uniqueKeys
      .filter((key) => (_.isObject(data1[key]) && _.isObject(data2[key])));
    const deletedKeys = _.difference(uniqueKeys, _.keys(data2));
    const addedKeys = _.difference(uniqueKeys, _.keys(data1));
    const changedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys, nodeKeys)
      .filter((key) => data1[key] !== data2[key]);
    const unchangedKeys = _.difference(uniqueKeys, nodeKeys, deletedKeys, addedKeys, changedKeys);

    const deleted = deletedKeys.map((key) => [key, 'deleted', data1[key]]);
    const added = addedKeys.map((key) => [key, 'added', data2[key]]);
    const changed = changedKeys.map((key) => [key, 'changed', data1[key], data2[key]]);
    const unchanged = unchangedKeys.map((key) => [key, 'unchanged', data1[key]]);
    const node = nodeKeys.map((key) => [key, 'node', iter(data1[key], data2[key])]);
    return [...deleted, ...added, ...changed, ...unchanged, ...node].sort();
  };
  const resultAstTree = iter(parsedData1, parsedData2);
  return formatter ? formatter(resultAstTree) : `error: incorrect format: ${format}`;
};

export default diff;
