import _ from 'lodash';

const genAstDiff = (data1, data2) => {
  const uniqueKeys = _.union(_.keys(data2), _.keys(data1));
  const nodeKeys = uniqueKeys
    .filter((key) => (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])));
  const deletedKeys = _.difference(uniqueKeys, _.keys(data2));
  const addedKeys = _.difference(uniqueKeys, _.keys(data1));
  const changedKeys = _.difference(uniqueKeys, deletedKeys, addedKeys, nodeKeys)
    .filter((key) => data1[key] !== data2[key]);
  const unchangedKeys = _.difference(uniqueKeys, nodeKeys, deletedKeys, addedKeys, changedKeys);

  const node = nodeKeys.map((key) => ({ key, nodeType: 'nested', children: genAstDiff(data1[key], data2[key]) }));
  const deleted = deletedKeys.map((key) => ({ key, nodeType: 'deleted', value1: data1[key] }));
  const added = addedKeys.map((key) => ({ key, nodeType: 'added', value2: data2[key] }));
  const changed = changedKeys.map((key) => (
    {
      key, nodeType: 'changed', value1: data1[key], value2: data2[key],
    }));
  const unchanged = unchangedKeys.map((key) => ({ key, nodeType: 'unchanged', value1: data1[key] }));
  return _.sortBy([...deleted, ...added, ...changed, ...unchanged, ...node], 'key');
};

export default genAstDiff;
