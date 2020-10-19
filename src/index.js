import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const diff = (filepath1, filepath2, format = 'stylish') => {
  const dataBefore = parse(filepath1);
  const dataAfter = parse(filepath2);

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

    const deletedProps = deletedKeys
      .map((key) => [key, 'deletedProperty', data1[key]]);
    const addedProps = addedKeys
      .map((key) => [key, 'addedProperty', data2[key]]);
    const changedProps = changedKeys
      .map((key) => [key, 'changedProperty', data1[key], data2[key]]);
    const unchangedProps = unchangedKeys
      .map((key) => [key, 'unchangedProperty', data1[key]]);
    const nodesProps = nodesKeys
      .map((key) => [key, 'nodeProperty', iter(data1[key], data2[key])]);
    return [...deletedProps, ...addedProps, ...changedProps, ...unchangedProps, ...nodesProps]
      .sort();
  };
  const resultAstTree = ['root', 'nodeProperty', iter(dataBefore, dataAfter)];
  const formatter = getFormatter(format);

  if (!formatter) {
    return `error: incorrect format: ${format}`;
  }
  return formatter(resultAstTree);
};

export default diff;
