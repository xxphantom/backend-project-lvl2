import _ from 'lodash';

const flags = {
  deleted: '- ',
  added: '+ ',
};
const genIndent = (depth, flagLength = 2, step = 4) => ' '.repeat(depth * step - flagLength);
const formatNode = (key, body, depth, flag = '  ') => {
  if (!_.isPlainObject(body)) {
    return `${genIndent(depth)}${flag}${key}: ${body}`;
  }
  const nestedProperties = Object.entries(body)
    .flatMap(([nestedkey, value]) => formatNode(nestedkey, value, depth + 1, flags.nested));
  return [`${genIndent(depth)}${flag}${key}: {`, ...nestedProperties, `${genIndent(depth, 0)}}`].join('\n');
};

const formatStylish = (ast) => {
  const iter = (tree, depth = 1) => tree.flatMap((node) => {
    const {
      key, nodeType, value1, value2, children,
    } = node;

    switch (nodeType) {
      case 'nested':
        return [
          `${genIndent(depth, 0)}${key}: {`, ...iter(children, depth + 1), `${genIndent(depth, 0)}}`];
      case 'changed':
        return [
          formatNode(key, value1, depth, flags.deleted),
          formatNode(key, value2, depth, flags.added),
        ];
      case 'added':
        return formatNode(key, value2, depth, flags[nodeType]);

      case 'deleted':
        return formatNode(key, value1, depth, flags[nodeType]);

      case 'unchanged':
        return formatNode(key, value1, depth);
      default:
        throw new Error(`Unexpected nodeType: ${nodeType}`);
    }
  });
  return `{\n${iter(ast).join('\n')}\n}`;
}; export default formatStylish;
