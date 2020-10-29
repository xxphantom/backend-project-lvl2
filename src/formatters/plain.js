import _ from 'lodash';

const flags = {
  deleted: 'removed',
  added: 'added with value:',
};
const formatNestedProp = (body) => {
  if (typeof body === 'string') {
    return ` '${body}'`;
  }
  return _.isObject(body) ? ' [complex value]' : ` ${body}`;
};

const formatPlain = (astTree) => {
  const iter = (ast, parentKey = '') => ast.flatMap((node) => {
    const {
      key, nodeType, value1, value2, children,
    } = node;
    const chainNodeNames = [parentKey, key].filter((n) => n !== '').join('.');

    switch (nodeType) {
      case 'unchanged':
        return '';
      case 'nested':
        return iter(children, `${chainNodeNames}`).join('');
      case 'changed':
        return `Property '${chainNodeNames}' was updated. From${formatNestedProp(value1)} to${formatNestedProp(value2)}\n`;
      case 'deleted':
        return `Property '${chainNodeNames}' was ${flags[nodeType]}\n`;
      case 'added':
        return `Property '${chainNodeNames}' was ${flags[nodeType]}${formatNestedProp(value2)}\n`;
      default:
        throw new Error(`Unexpected nodeType: ${nodeType}`);
    }
  });
  return iter(astTree).join('').trim();
};
export default formatPlain;
