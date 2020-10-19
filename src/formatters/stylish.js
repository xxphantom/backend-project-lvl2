import _ from 'lodash';

const indentLength = 4;
const space = ' ';
const openBracket = '{';
const closeBracket = '}';
const flag = {
  deletedProperty: '- ',
  addedProperty: '+ ',
  unchangedProperty: '',
  nodeProperty: '',
  changedProperty: { before: '- ', after: '+ ', length: 2 },
};
const formatNestedProperty = (data, deepCount) => {
  if (!_.isObject(data)) {
    return data;
  }
  const openIndent = space.repeat(deepCount);
  const closeIndent = space.repeat(deepCount - indentLength);
  const nestedProperties = Object.entries(data).map(([name, value]) => {
    const nestedValue = formatNestedProperty(value, deepCount + indentLength);
    return `\n${openIndent}${name}: ${nestedValue}`;
  }).join('');
  return `${openBracket}${nestedProperties}\n${closeIndent}${closeBracket}`;
};

const stylish = (astTree) => {
  const iter = (ast, deep = 0) => {
    const propertyName = ast[0];
    const nodeType = ast[1];
    const body = ast[2];
    const bodyChanged = ast[3];
    const indent = space.repeat(deep - flag[nodeType].length);

    if (nodeType === 'nodeProperty') {
      const nodeName = deep === 0 ? '' : `${indent}${propertyName}: `;
      const nestedProperties = body.map((a) => iter(a, deep + indentLength)).join('');
      return `${nodeName}${openBracket}\n${nestedProperties}${indent}${closeBracket}\n`;
    }

    const value = formatNestedProperty(body, deep + indentLength);

    if (nodeType === 'changedProperty') {
      const valueAfter = formatNestedProperty(bodyChanged, deep + indentLength);
      return `${indent}${flag[nodeType].before}${propertyName}: ${value}\n${indent}${flag[nodeType].after}${propertyName}: ${valueAfter}\n`;
    }
    return `${indent}${flag[nodeType]}${propertyName}: ${value}\n`;
  };
  return iter(astTree);
};

export default stylish;
