import _ from 'lodash';

const genAstDiff = (data1, data2) => {
  const uniqueKeys = _.union(_.keys(data2), _.keys(data1));
  const ast = uniqueKeys.map((key) => {
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      return { key, nodeType: 'nested', children: genAstDiff(data1[key], data2[key]) };
    }
    if (!_.has(data2, key)) {
      return { key, nodeType: 'deleted', value1: data1[key] };
    }
    if (!_.has(data1, key)) {
      return { key, nodeType: 'added', value2: data2[key] };
    }
    if (data1[key] !== data2[key]) {
      return {
        key, nodeType: 'changed', value1: data1[key], value2: data2[key],
      };
    }
    return { key, nodeType: 'unchanged', value1: data1[key] };
  });
  return _.sortBy(ast, 'key');
};

export default genAstDiff;
