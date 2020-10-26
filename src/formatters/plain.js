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
  const iter = (ast, parentKey = '') => {
    const {
      key, nodeType, value1, value2, children,
    } = ast;
    const chainNodeNames = [parentKey, key].filter((n) => n !== '').join('.');

    switch (nodeType) {
      case 'unchanged':
        return '';
      case 'nested':
        return children.map((a) => iter(a, `${chainNodeNames}`)).join('');
      case 'changed':
        return `Property '${chainNodeNames}' was updated. From${formatNestedProp(value1)} to${formatNestedProp(value2)}\n`;
      case 'deleted':
        return `Property '${chainNodeNames}' was ${flags[nodeType]}\n`;
      case 'added':
        return `Property '${chainNodeNames}' was ${flags[nodeType]}${formatNestedProp(value2)}\n`;
      default:
        throw new Error(`Unexpected nodeType: ${nodeType}`);
    }
  };
  return astTree.map((node) => iter(node)).join('');
};
export default formatPlain;
