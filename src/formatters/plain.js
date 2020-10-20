import _ from 'lodash';

const flag = {
  deletedProperty: 'removed',
  addedProperty: 'added with value:',
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
      case 'unchangedProperty':
        return '';
      case 'nodeProperty':
        return body.map((a) => iter(a, `${chainNodeNames}`)).join('');
      case 'changedProperty':
        return `Property '${chainNodeNames}' was updated. From${formatNestedProperty(body)} to${formatNestedProperty(bodyChanged)}\n`;
      default:
        return `Property '${chainNodeNames}' was ${flag[nodeType]}${nodeType === 'deletedProperty' ? '' : formatNestedProperty(body)}\n`;
    }
  };
  return astTree.map((node) => iter(node)).join('');
};
export default plain;
