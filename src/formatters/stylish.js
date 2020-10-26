import _ from 'lodash';

const indentLength = 4;
const space = ' ';
const openBracket = '{';
const closeBracket = '}';
const flag = {
  deleted: '- ',
  added: '+ ',
  unchanged: '',
  nested: '',
  changed: { before: '- ', after: '+ ', length: 2 },
};
const buildIndent = (depth, flagLength = 0) => space.repeat(depth * indentLength - flagLength);

const formatNestedProp = (data, depth) => {
  if (!_.isObject(data)) {
    return data;
  }
  const openIndent = buildIndent(depth);
  const closeIndent = buildIndent(depth - 1);
  const nestedProperties = Object.entries(data)
    .map(([name, value]) => `\n${openIndent}${name}: ${formatNestedProp(value, depth + 1)}`).join('');
  return `${openBracket}${nestedProperties}\n${closeIndent}${closeBracket}`;
};

const formatStylish = (astTree) => {
  const iter = (ast, depth = 1) => {
    const {
      key, nodeType, value1, value2, children,
    } = ast;
    const indent = buildIndent(depth, flag[nodeType].length);

    switch (nodeType) {
      case 'nested':
        return `${indent}${key}: ${openBracket}\n${children.map((a) => iter(a, depth + 1)).join('')}${indent}${closeBracket}\n`;

      case 'changed':
        return `${indent}${flag[nodeType].before}${key}: ${formatNestedProp(value1, depth + 1)}\n${indent}${flag[nodeType].after}${key}: ${formatNestedProp(value2, depth + 1)}\n`;

      case 'added':
        return `${indent}${flag[nodeType]}${key}: ${formatNestedProp(value2, depth + 1)}\n`;

      case 'deleted':
      case 'unchanged':
        return `${indent}${flag[nodeType]}${key}: ${formatNestedProp(value1, depth + 1)}\n`;
      default:
        throw new Error(`Unexpected nodeType: ${nodeType}`);
    }
  };
  return `${openBracket}\n${astTree.map((node) => iter(node)).join('')}${closeBracket}\n`;
};
export default formatStylish;
