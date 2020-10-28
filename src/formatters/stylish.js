import _ from 'lodash';

const flags = {
  deleted: '- ',
  added: '+ ',
};
const genIndent = (depth, flagLength = 2, step = 4) => ' '.repeat(depth * step - flagLength);
const formatNode = (key, body, depth, flag = '  ') => {
  if (!_.isPlainObject(body)) {
    return `${genIndent(depth)}${flag}${key}: ${body}\n`;
  }
  const nestedProperties = Object.entries(body)
    .map(([nestedkey, value]) => formatNode(nestedkey, value, depth + 1, flags.nested)).join('');
  return `${genIndent(depth)}${flag}${key}: {\n${nestedProperties}${genIndent(depth, 0)}}\n`;
};

const formatStylish = (astTree) => {
  const iter = (ast, depth = 1) => {
    const {
      key, nodeType, value1, value2, children,
    } = ast;

    switch (nodeType) {
      case 'nested':
        return `${genIndent(depth, 0)}${key}: {\n${children.map((a) => iter(a, depth + 1)).join('')}${genIndent(depth, 0)}}\n`;

      case 'changed':
        return `${formatNode(key, value1, depth, flags.deleted)}${formatNode(key, value2, depth, flags.added)}`;

      case 'added':
        return formatNode(key, value2, depth, flags[nodeType]);

      case 'deleted':
        return formatNode(key, value1, depth, flags[nodeType]);

      case 'unchanged':
        return formatNode(key, value1, depth);
      default:
        throw new Error(`Unexpected nodeType: ${nodeType}`);
    }
  };
  return `{\n${astTree.map((node) => iter(node)).join('')}}\n`;
}; export default formatStylish;
