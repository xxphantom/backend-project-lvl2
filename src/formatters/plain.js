import _ from 'lodash';

const flag = {
  deleted: 'removed',
  added: 'added with value:',
};
const formatNestedProperty = (body) => {
  if (typeof body === 'string') {
    return ` '${body}'`;
  }
  return _.isObject(body) ? ' [complex value]' : ` ${body}`;
};

const plain = (astTree) => {
  const iter = (ast, parentName = '') => {
    const [propertyName, nodeType, body, bodyChanged] = ast;
    const chainNodeNames = [parentName, propertyName].filter((n) => n !== '').join('.');

    switch (nodeType) {
      case 'unchanged':
        return '';
      case 'node':
        return body.map((a) => iter(a, `${chainNodeNames}`)).join('');
      case 'changed':
        return `Property '${chainNodeNames}' was updated. From${formatNestedProperty(body)} to${formatNestedProperty(bodyChanged)}\n`;
      default:
        return `Property '${chainNodeNames}' was ${flag[nodeType]}${nodeType === 'deleted' ? '' : formatNestedProperty(body)}\n`;
    }
  };
  return astTree.map((node) => iter(node)).join('');
};
export default plain;
