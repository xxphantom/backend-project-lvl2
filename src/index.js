import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const diff = (filepath1, filepath2, format = 'stylish') => {
  const dataBefore = parse(filepath1);
  const dataAfter = parse(filepath2);
  const formatter = getFormatter(format);

  const iter = (data1, data2) => {
    const uniqueKeys = _.union(_.keys(data2), _.keys(data1)).sort();
    const deletedKeys = _.difference(uniqueKeys, _.keys(data2));
    const addedKeys = _.difference(uniqueKeys, _.keys(data1));
    const nodesKeys = _.difference(uniqueKeys, deletedKeys, addedKeys)
      .filter((key) => (_.isObject(data1[key]) && _.isObject(data2[key])));
    const changedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys, nodesKeys)
      .filter((key) => data1[key] !== data2[key]);
    const unchangedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys, nodesKeys)
      .filter((key) => data1[key] === data2[key]);

    const deletedProps = deletedKeys.map((key) => [key, 'deleted', data1[key]]);
    const addedProps = addedKeys.map((key) => [key, 'added', data2[key]]);
    const changedProps = changedKeys.map((key) => [key, 'changed', data1[key], data2[key]]);
    const unchangedProps = unchangedKeys.map((key) => [key, 'unchanged', data1[key]]);
    const nodesProps = nodesKeys.map((key) => [key, 'node', iter(data1[key], data2[key])]);
    return [...deletedProps, ...addedProps, ...changedProps, ...unchangedProps, ...nodesProps]
      .sort();
  };
  const resultAstTree = iter(dataBefore, dataAfter);
  return formatter ? formatter(resultAstTree) : `error: incorrect format: ${format}`;
};

export default diff;
