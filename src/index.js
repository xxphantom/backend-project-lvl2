import _ from 'lodash';
import parse from './parsers.js';

const stylish = (astTree) => {
  const indentLength = 4;
  const space = ' ';
  const openBracket = '{';
  const closeBracket = '}';

  const iter = (ast, deep = 0) => {
    const propertyName = ast[0];
    const type = ast[1];
    const body = ast[2];
    const bodyChanged = ast[3];
    const flag = {
      deletedProperty: ['- '],
      addedProperty: ['+ '],
      changedProperty: ['- ', '+ '],
      unchangedProperty: [''],
      nodeProperty: [''],
    };
    const indent = space.repeat(deep - flag[type][0].length);

    const formatNestedProperty = (value, deepCount) => {
      if (!_.isObject(value)) {
        return value;
      }
      const indentForBracket = space.repeat(deepCount - indentLength);
      const nestedProperties = Object.entries(value).map(([pName, pValue]) => {
        const pIndent = space.repeat(deepCount);
        const nestedValue = formatNestedProperty(pValue, deepCount + indentLength);
        return `\n${pIndent}${pName}: ${nestedValue}`;
      }).join('');
      return `${openBracket}${nestedProperties}\n${indentForBracket}${closeBracket}`;
    };

    if (type === 'nodeProperty') {
      const nodeName = deep === 0 ? '' : `${indent}${propertyName}: `;
      const nestedProperties = body.map((a) => iter(a, deep + indentLength)).join('');
      return `${nodeName}${openBracket}\n${nestedProperties}${indent}${closeBracket}\n`;
    }

    const value = formatNestedProperty(body, deep + indentLength);

    if (type === 'changedProperty') {
      const valueAfter = formatNestedProperty(bodyChanged, deep + indentLength);
      const flagBefore = flag[type][0];
      const flagAfter = flag[type][1];
      return `${indent}${flagBefore}${propertyName}: ${value}\n${indent}${flagAfter}${propertyName}: ${valueAfter}\n`;
    }
    return `${indent}${flag[type]}${propertyName}: ${value}\n`;
  };
  return iter(astTree);
};

const diff = (filepath1, filepath2, format) => {
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
  if (format === 'stylish') {
    return stylish(['', 'nodeProperty', iter(dataBefore, dataAfter)]);
  }
  return `error: incorrect format: ${format}`;
};

export default diff;
