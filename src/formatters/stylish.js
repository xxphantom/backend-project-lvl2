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

const formatNestedProp = (data, deepCount) => {
  if (!_.isObject(data)) {
    return data;
  }
  const openIndent = space.repeat(deepCount);
  const closeIndent = space.repeat(deepCount - indentLength);
  const nestedProperties = Object.entries(data).map(([name, value]) => `\n${openIndent}${name}: ${formatNestedProp(value, deepCount + indentLength)}`).join('');
  return `${openBracket}${nestedProperties}\n${closeIndent}${closeBracket}`;
};

const stylish = (astTree) => {
  const iter = (ast, deep = 4) => {
    const [propName, nodeType, body, changedBody] = ast;
    const indent = space.repeat(deep - flag[nodeType].length);

    switch (nodeType) {
      case 'nodeProperty':
        return `${indent}${propName}: ${openBracket}\n${body.map((a) => iter(a, deep + indentLength)).join('')}${indent}${closeBracket}\n`;

      case 'changedProperty':
        return `${indent}${flag[nodeType].before}${propName}: ${formatNestedProp(body, deep + indentLength)}\n${indent}${flag[nodeType].after}${propName}: ${formatNestedProp(changedBody, deep + indentLength)}\n`;

      default: return `${indent}${flag[nodeType]}${propName}: ${formatNestedProp(body, deep + indentLength)}\n`;
    }
  };
  return `${openBracket}\n${astTree.map((node) => iter(node)).join('')}${closeBracket}\n`;
};
export default stylish;
