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

    const result = uniqueKeys.map((key) => {
      if (nodesKeys.includes(key)) {
        return [key, 'nodeProperty', iter(data1[key], data2[key])];
      }
      if (deletedKeys.includes(key)) {
        return [key, 'deletedProperty', data1[key]];
      }
      if (addedKeys.includes(key)) {
        return [key, 'addedProperty', data2[key]];
      }
      if (changedKeys.includes(key)) {
        return [key, 'changedProperty', data1[key], data2[key]];
      }
      return [key, 'unchangedProperty', data1[key]];
    });
    return result;
  };
  const resultAstTree = ['', 'nodeProperty', iter(dataBefore, dataAfter)];
  const formatter = getFormatter(format);

  if (!formatter) {
    return `error: incorrect format: ${format}`;
  }
  return formatter(resultAstTree);
};

export default diff;
