import _ from 'lodash';

const flags = {
  deleted: '- ',
  added: '+ ',
};
const genIndent = (depth, flag = '', indentStep = 4) => `${' '.repeat(depth * indentStep - flag.length)}${flag}`;
const formatNestedProp = (data, depth) => {
  if (!_.isObject(data)) {
    return data;
  }
  const nestedProperties = Object.entries(data)
    .map(([name, value]) => `\n${genIndent(depth)}${name}: ${formatNestedProp(value, depth + 1)}`).join('');
  return `{${nestedProperties}\n${genIndent(depth - 1)}}`;
};

const formatStylish = (astTree) => {
  const iter = (ast, depth = 1) => {
    const {
      key, nodeType, value1, value2, children,
    } = ast;
    const indent = genIndent(depth, flags[nodeType]);

    switch (nodeType) {
      case 'nested':
        return `${indent}${key}: {\n${children.map((a) => iter(a, depth + 1)).join('')}${indent}}\n`;

      case 'changed':
        return `${genIndent(depth, flags.deleted)}${key}: ${formatNestedProp(value1, depth + 1)}\n${genIndent(depth, flags.added)}${key}: ${formatNestedProp(value2, depth + 1)}\n`;

      case 'added':
        return `${indent}${key}: ${formatNestedProp(value2, depth + 1)}\n`;

      case 'deleted':
      case 'unchanged':
        return `${indent}${key}: ${formatNestedProp(value1, depth + 1)}\n`;
      default:
        throw new Error(`Unexpected nodeType: ${nodeType}`);
    }
  };
  return `{\n${astTree.map((node) => iter(node)).join('')}}\n`;
};
export default formatStylish;
